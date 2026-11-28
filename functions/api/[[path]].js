// WOG COMPUTER V5.0.0 — API administrativa (homologação)
// Requer Cloudflare Pages Functions + D1.
// Segredos: ADMIN_BOOTSTRAP_TOKEN; CLOUDINARY_* (somente se usar upload).
// Senhas: PBKDF2-SHA-256. Sessões: token aleatório + hash persistido em D1.

const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers }
  });

const enc = new TextEncoder();
const SESSION_HOURS = 8;
const PBKDF2_ITERATIONS = 310000;
const COOKIE_NAME = "wog_admin";

function b64url(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function fromB64url(s) {
  return Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - s.length % 4) % 4)), c => c.charCodeAt(0));
}
function randomId() { return crypto.randomUUID(); }
function cookie(value, maxAge) {
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}
async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(value));
  return [...new Uint8Array(digest)].map(x => x.toString(16).padStart(2, "0")).join("");
}
async function passwordHash(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" }, key, 256);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${b64url(salt)}$${b64url(bits)}`;
}
async function verifyPassword(password, stored) {
  try {
    const [scheme, iterations, saltText, hashText] = stored.split("$");
    if (scheme !== "pbkdf2" || Number(iterations) < 100000) return false;
    const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits({
      name: "PBKDF2", salt: fromB64url(saltText), iterations: Number(iterations), hash: "SHA-256"
    }, key, 256);
    const actual = b64url(bits), expected = hashText;
    return actual.length === expected.length && [...actual].reduce((n, c, i) => n | (c.charCodeAt(0) ^ expected.charCodeAt(i)), 0) === 0;
  } catch { return false; }
}
function text(v, max = 5000) { return String(v ?? "").trim().slice(0, max); }
function slugify(v) {
  return text(v, 180).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90);
}
function sameOrigin(request) {
  const origin = request.headers.get("Origin");
  if (!origin) return false;
  try { return new URL(origin).origin === new URL(request.url).origin; } catch { return false; }
}
function clientIp(request) { return request.headers.get("CF-Connecting-IP") || "unknown"; }
async function ipHash(request) { return sha256(`${clientIp(request)}|wog-v5-admin`); }

async function audit(env, actorId, action, entityType, entityId, details, request) {
  await env.DB.prepare(
    "INSERT INTO audit_logs(id,actor_user_id,action,entity_type,entity_id,details_json,ip_hash) VALUES(?,?,?,?,?,?,?)"
  ).bind(randomId(), actorId || null, action, entityType, entityId || null,
    JSON.stringify(details || {}), await ipHash(request)).run();
}
async function recordFailure(env, request) {
  const key = await ipHash(request), now = Math.floor(Date.now() / 1000);
  const row = await env.DB.prepare("SELECT attempts,window_started FROM admin_login_attempts WHERE ip_hash=?").bind(key).first();
  const attempts = row && row.window_started > now - 900 ? row.attempts + 1 : 1;
  const blocked = attempts >= 5 ? now + 900 : 0;
  await env.DB.prepare(`INSERT INTO admin_login_attempts(ip_hash,attempts,window_started,blocked_until)
    VALUES(?,?,?,?) ON CONFLICT(ip_hash) DO UPDATE SET attempts=excluded.attempts,
    window_started=excluded.window_started,blocked_until=excluded.blocked_until`)
    .bind(key, attempts, now, blocked).run();
}
async function loginAllowed(env, request) {
  const key = await ipHash(request), now = Math.floor(Date.now() / 1000);
  const row = await env.DB.prepare("SELECT attempts,window_started,blocked_until FROM admin_login_attempts WHERE ip_hash=?").bind(key).first();
  return !row || (row.blocked_until <= now && (row.window_started <= now - 900 || row.attempts < 5));
}
async function clearFailures(env, request) {
  await env.DB.prepare("DELETE FROM admin_login_attempts WHERE ip_hash=?").bind(await ipHash(request)).run();
}
async function currentAdmin(request, env) {
  const raw = (request.headers.get("Cookie") || "").split(";").map(x => x.trim())
    .find(x => x.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1);
  if (!raw || raw.length < 32) return null;
  const tokenHash = await sha256(raw);
  const now = new Date().toISOString();
  const row = await env.DB.prepare(`SELECT u.id,u.email,u.full_name,u.status,s.id session_id
    FROM admin_sessions s JOIN admin_users u ON u.id=s.user_id
    WHERE s.token_hash=? AND s.revoked_at IS NULL AND s.expires_at>? AND u.status='active'`)
    .bind(tokenHash, now).first();
  return row || null;
}
async function hasPermission(env, userId, module, action) {
  const row = await env.DB.prepare(`SELECT 1 AS ok FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id=ur.role_id
    JOIN permissions p ON p.id=rp.permission_id
    JOIN roles r ON r.id=ur.role_id
    WHERE ur.user_id=? AND p.module=? AND p.action=? LIMIT 1`)
    .bind(userId, module, action).first();
  return !!row;
}
async function requirePermission(env, user, module, action) {
  return user && await hasPermission(env, user.id, module, action);
}
async function requireBody(request) {
  const body = await request.json().catch(() => null);
  return body && typeof body === "object" && !Array.isArray(body) ? body : null;
}
async function ensureBootstrap(env, request, body) {
  if (!env.ADMIN_BOOTSTRAP_TOKEN || !body.bootstrapToken ||
      body.bootstrapToken !== env.ADMIN_BOOTSTRAP_TOKEN) return json({ error: "Autorização inicial inválida." }, 403);
  const existing = await env.DB.prepare("SELECT COUNT(*) AS total FROM admin_users").first();
  if ((existing?.total || 0) > 0) return json({ error: "O administrador inicial já foi criado." }, 409);

  const email = text(body.email, 190).toLowerCase();
  const fullName = text(body.fullName, 160);
  const password = String(body.password || "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !fullName || password.length < 12)
    return json({ error: "Informe nome, e-mail válido e senha com pelo menos 12 caracteres." }, 400);

  const roleId = randomId(), userId = randomId();
  const permissions = [
    ["dashboard","view"],["users","view"],["users","create"],["users","update"],["users","block"],
    ["roles","view"],["roles","manage"],["products","view"],["products","create"],["products","update"],
    ["products","delete"],["categories","view"],["categories","manage"],["customers","view"],
    ["orders","view"],["orders","update"],["payments","view"],["shipments","view"],["shipments","update"],
    ["settings","view"],["settings","update"],["audit","view"],["inventory","view"],["inventory","adjust"]
  ];
  const batch = [
    env.DB.prepare("INSERT INTO roles(id,name,description,is_system) VALUES(?,?,?,1)")
      .bind(roleId, "Superadministrador", "Acesso total ao sistema WOG COMPUTER"),
    env.DB.prepare("INSERT INTO admin_users(id,email,full_name,password_hash,status,password_changed_at) VALUES(?,?,?,?,'active',CURRENT_TIMESTAMP)")
      .bind(userId, email, fullName, await passwordHash(password)),
    env.DB.prepare("INSERT INTO user_roles(user_id,role_id) VALUES(?,?)").bind(userId, roleId)
  ];
  for (const [module, action] of permissions) {
    const permissionId = randomId();
    batch.push(env.DB.prepare("INSERT OR IGNORE INTO permissions(id,module,action,description) VALUES(?,?,?,?)")
      .bind(permissionId, module, action, `${module}: ${action}`));
    batch.push(env.DB.prepare(`INSERT INTO role_permissions(role_id,permission_id)
      SELECT ?,id FROM permissions WHERE module=? AND action=?`).bind(roleId, module, action));
  }
  await env.DB.batch(batch);
  // A criação da conta não pode ser reportada como falha depois de já ter sido
  // confirmada no D1. Se a auditoria falhar por divergência de schema no banco
  // implantado, registrar no log do Worker e informar o aviso sem bloquear o login.
  let auditWarning = false;
  try {
    await audit(env, userId, "bootstrap.create", "admin_user", userId, { email }, request);
  } catch (error) {
    auditWarning = true;
    console.error("[WOG V5] Falha ao registrar auditoria do bootstrap:", error?.stack || error);
  }
  return json({ ok: true, auditWarning, message: "Administrador inicial criado. Faça login pela tela administrativa." }, 201);
}
async function createSession(env, user, request) {
  const token = b64url(crypto.getRandomValues(new Uint8Array(32)));
  const expires = new Date(Date.now() + SESSION_HOURS * 3600000).toISOString();
  await env.DB.prepare("INSERT INTO admin_sessions(id,user_id,token_hash,expires_at) VALUES(?,?,?,?)")
    .bind(randomId(), user.id, await sha256(token), expires).run();
  await env.DB.prepare("UPDATE admin_users SET last_login_at=CURRENT_TIMESTAMP WHERE id=?").bind(user.id).run();
  await audit(env, user.id, "login.success", "admin_user", user.id, {}, request);
  return token;
}
async function cloudinarySignature(params, secret) {
  const canonical = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join("&") + secret;
  const digest = await crypto.subtle.digest("SHA-1", enc.encode(canonical));
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("");
}


function timingSafeEqual(a,b){ if(typeof a!=="string"||typeof b!=="string"||a.length!==b.length)return false;let x=0;for(let i=0;i<a.length;i++)x|=a.charCodeAt(i)^b.charCodeAt(i);return x===0; }
async function hmacHex(secret, message){
  const key=await crypto.subtle.importKey("raw",enc.encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  const sig=await crypto.subtle.sign("HMAC",key,enc.encode(message));
  return [...new Uint8Array(sig)].map(b=>b.toString(16).padStart(2,"0")).join("");
}
async function verifyMpWebhook(request, env, dataId){
  const secret=env.MP_WEBHOOK_SECRET, signature=request.headers.get("x-signature")||"", requestId=request.headers.get("x-request-id")||"";
  if(!secret||!dataId||!requestId)return false;
  const parts=Object.fromEntries(signature.split(",").map(x=>x.trim().split("=").map(y=>y.trim())));
  if(!parts.ts||!parts.v1)return false;
  const manifest=`id:${String(dataId).toLowerCase()};request-id:${requestId};ts:${parts.ts};`;
  return timingSafeEqual(await hmacHex(secret,manifest),parts.v1);
}
async function updateOrderFromMp(env, paymentId, eventId){
  const r = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: `Bearer ${env.MP_ACCESS_TOKEN}` }
  });
  if (!r.ok) throw new Error("Falha ao consultar pagamento no Mercado Pago");

  const p = await r.json();
  const orderId = text(p.external_reference, 80);
  if (!orderId) return;

  const order = await env.DB.prepare(
    "SELECT id,payment_status FROM orders WHERE id=?"
  ).bind(orderId).first();
  if (!order) return;

  const pay = await env.DB.prepare(
    "SELECT id FROM payments WHERE order_id=? AND provider='mercadopago' ORDER BY created_at DESC LIMIT 1"
  ).bind(orderId).first();
  if (!pay) return;

  // Registra o evento antes de alterar estoque. Eventos repetidos não podem
  // baixar estoque ou liberar reservas novamente.
  const event = await env.DB.prepare(`INSERT OR IGNORE INTO payment_events
    (id,payment_id,provider_event_id,event_type,payload_json,processed_at)
    VALUES(?,?,?,?,?,CURRENT_TIMESTAMP)`)
    .bind(randomId(), pay.id, String(eventId || paymentId), String(p.status || "unknown"),
      JSON.stringify({ id: p.id, status: p.status, status_detail: p.status_detail })).run();
  if (!event.meta?.changes) return;

  if (p.status === "approved") {
    // A transição condicional garante que apenas uma notificação aprove o pedido
    // e execute a baixa de estoque.
    const transition = await env.DB.prepare(`UPDATE orders
      SET status='paid',payment_status='paid',updated_at=CURRENT_TIMESTAMP
      WHERE id=? AND payment_status<>'paid'`).bind(orderId).run();

    if (transition.meta?.changes) {
      const items = await env.DB.prepare(
        "SELECT variant_id,quantity FROM order_items WHERE order_id=?"
      ).bind(orderId).all();
      const batch = [];
      for (const it of items.results || []) {
        batch.push(env.DB.prepare(`UPDATE product_variants
          SET stock_quantity=MAX(0,stock_quantity-?),
              reserved_quantity=MAX(0,reserved_quantity-?)
          WHERE id=?`).bind(it.quantity, it.quantity, it.variant_id));
        batch.push(env.DB.prepare(`INSERT INTO inventory_movements
          (variant_id,movement_type,quantity,reason,reference_id)
          VALUES(?,'venda',?,'Pedido pago',?)`).bind(it.variant_id, -it.quantity, orderId));
      }
      batch.push(env.DB.prepare(`UPDATE payments
        SET status='approved',provider_payment_id=?,updated_at=CURRENT_TIMESTAMP
        WHERE id=?`).bind(String(p.id), pay.id));
      await env.DB.batch(batch);
    } else {
      await env.DB.prepare(`UPDATE payments SET status='approved',
        provider_payment_id=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`)
        .bind(String(p.id), pay.id).run();
    }
  } else if (["rejected", "cancelled", "refunded", "charged_back"].includes(p.status)) {
    const transition = await env.DB.prepare(`UPDATE orders
      SET status='payment_failed',payment_status=?,updated_at=CURRENT_TIMESTAMP
      WHERE id=? AND payment_status NOT IN ('paid','refunded','charged_back')`)
      .bind(p.status, orderId).run();

    if (transition.meta?.changes) {
      const items = await env.DB.prepare(
        "SELECT variant_id,quantity FROM order_items WHERE order_id=?"
      ).bind(orderId).all();
      const batch = (items.results || []).map(it => env.DB.prepare(
        "UPDATE product_variants SET reserved_quantity=MAX(0,reserved_quantity-?) WHERE id=?"
      ).bind(it.quantity, it.variant_id));
      batch.push(env.DB.prepare(`UPDATE payments SET status=?,provider_payment_id=?,
        updated_at=CURRENT_TIMESTAMP WHERE id=?`).bind(p.status, String(p.id), pay.id));
      await env.DB.batch(batch);
    }
  } else {
    await env.DB.prepare(`UPDATE payments SET status=?,provider_payment_id=?,
      updated_at=CURRENT_TIMESTAMP WHERE id=?`)
      .bind(String(p.status || "pending"), String(p.id), pay.id).run();
  }
}
async function route(request, env) {
  if (!env.DB) return json({ error: "Banco D1 não configurado." }, 503);
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api\/?/, "").replace(/^\/+|\/+$/g, "");
  const method = request.method.toUpperCase();

  // Webhooks são chamadas servidor-servidor e normalmente não enviam Origin.
  // Todas as demais mutações continuam protegidas por validação de mesma origem.
  const isMercadoPagoWebhook = path === "payments/mercadopago/webhook" && method === "POST";
  if (["POST","PUT","PATCH","DELETE"].includes(method) && !isMercadoPagoWebhook && !sameOrigin(request))
    return json({ error: "Origem da solicitação não autorizada." }, 403);

  if (path === "admin/status" && method === "GET") {
    const row = await env.DB.prepare("SELECT COUNT(*) AS total FROM admin_users").first();
    return json({ setupRequired: (row?.total || 0) === 0 });
  }

  if (path === "admin/bootstrap" && method === "POST") {
    const body = await requireBody(request);
    return body ? ensureBootstrap(env, request, body) : json({ error: "JSON inválido." }, 400);
  }

  if (path === "admin/login" && method === "POST") {
    const body = await requireBody(request);
    if (!body) return json({ error: "JSON inválido." }, 400);
    if (!await loginAllowed(env, request)) return json({ error: "Muitas tentativas. Aguarde 15 minutos." }, 429, { "retry-after": "900" });
    const email = text(body.email, 190).toLowerCase(), password = String(body.password || "");
    const user = await env.DB.prepare("SELECT * FROM admin_users WHERE email=? LIMIT 1").bind(email).first();
    if (!user || user.status !== "active" || !await verifyPassword(password, user.password_hash)) {
      await recordFailure(env, request);
      return json({ error: "E-mail ou senha inválidos." }, 401);
    }
    await clearFailures(env, request);
    const token = await createSession(env, user, request);
    return json({ ok: true, user: { id: user.id, email: user.email, fullName: user.full_name } },
      200, { "set-cookie": cookie(token, SESSION_HOURS * 3600) });
  }

  // API pública do catálogo: somente produtos publicados (ativos ou indisponíveis).
  // Estoque zero altera a disponibilidade, nunca a visibilidade do cadastro.
  if (path === "store/categories" && method === "GET") {
    const { results = [] } = await env.DB.prepare(
      "SELECT id,parent_id,name,slug,description,image_url,sort_order FROM categories WHERE is_active=1 ORDER BY parent_id,sort_order,name"
    ).all();
    return json({ categories: results });
  }
  if (path === "store/products" && method === "GET") {
    const q = text(url.searchParams.get("q"), 120).toLocaleLowerCase("pt-BR");
    const category = text(url.searchParams.get("category"), 100);
    const subcategory = text(url.searchParams.get("subcategory"), 100);
    const limit = Math.min(250, Math.max(1, Number(url.searchParams.get("limit") || 60)));
    const offset = Math.max(0, Number(url.searchParams.get("offset") || 0));
    const { results = [] } = await env.DB.prepare(`
      SELECT p.id,p.name,p.slug,p.manufacturer,p.model,p.short_description,p.description,p.status,
        p.is_featured,p.category_id,c.name AS category_name,c.slug AS category_slug,
        pc.name AS parent_category_name,pc.slug AS parent_category_slug,
        v.id AS variant_id,v.sku,v.price_cents,v.sale_price_cents,v.stock_quantity,v.reserved_quantity,
        CASE WHEN v.is_active=1 AND (v.stock_quantity-v.reserved_quantity)>0 THEN 1 ELSE 0 END AS available,
        (SELECT image_url FROM product_images i WHERE i.product_id=p.id ORDER BY sort_order,id LIMIT 1) AS image_url
      FROM products p
      JOIN categories c ON c.id=p.category_id
      LEFT JOIN categories pc ON pc.id=c.parent_id
      LEFT JOIN product_variants v ON v.product_id=p.id AND v.is_active=1
      WHERE p.status IN ('ativo','indisponivel') AND c.is_active=1
        AND (?='' OR p.name LIKE '%'||?||'%' OR p.manufacturer LIKE '%'||?||'%' OR v.sku LIKE '%'||?||'%')
        AND (?='' OR c.slug=? OR pc.slug=?)
        AND (?='' OR c.slug=?)
      ORDER BY p.is_featured DESC,p.name COLLATE NOCASE
      LIMIT ? OFFSET ?`).bind(q,q,q,q,category,category,category,subcategory,subcategory,limit,offset).all();
    return json({ products: results, limit, offset });
  }
  const publicProductMatch = path.match(/^store\/products\/([a-z0-9-]+)$/i);
  if (publicProductMatch && method === "GET") {
    const { results = [] } = await env.DB.prepare(`
      SELECT p.id,p.name,p.slug,p.manufacturer,p.model,p.short_description,p.description,p.status,
        c.name AS category_name,c.slug AS category_slug,pc.name AS parent_category_name,
        v.sku,v.price_cents,v.sale_price_cents,v.stock_quantity,v.reserved_quantity,
        CASE WHEN v.is_active=1 AND (v.stock_quantity-v.reserved_quantity)>0 THEN 1 ELSE 0 END AS available
      FROM products p JOIN categories c ON c.id=p.category_id
      LEFT JOIN categories pc ON pc.id=c.parent_id
      LEFT JOIN product_variants v ON v.product_id=p.id AND v.is_active=1
      WHERE p.slug=? AND p.status IN ('ativo','indisponivel') LIMIT 1`).bind(publicProductMatch[1]).all();
    if (!results.length) return json({error:"Produto não encontrado."},404);
    const images = await env.DB.prepare("SELECT image_url,alt_text,image_type FROM product_images WHERE product_id=? ORDER BY sort_order,id").bind(results[0].id).all();
    return json({product:results[0],images:images.results||[]});
  }


  // Webhook Mercado Pago: verifica assinatura e consulta o pagamento na API oficial.
  if (path === "payments/mercadopago/webhook" && method === "POST") {
    if(!env.MP_ACCESS_TOKEN||!env.MP_WEBHOOK_SECRET)return json({error:"Gateway não configurado."},503);
    const body=await requireBody(request), dataId=url.searchParams.get("data.id")||body?.data?.id;
    if(!await verifyMpWebhook(request,env,dataId))return json({error:"Assinatura inválida."},401);
    try{await updateOrderFromMp(env,dataId,body?.id||dataId);return json({received:true});}
    catch{return json({error:"Falha ao processar notificação."},500);}
  }

  // Cotação Melhor Envio; preço retornado pelo servidor é recalculado no checkout.
  if (path === "store/shipping/quote" && method === "POST") {
    if(!env.MELHORENVIO_TOKEN||!env.MELHORENVIO_FROM_POSTAL_CODE)return json({error:"Frete ainda não configurado. Escolha retirada na loja."},503);
    const body=await requireBody(request), cep=text(body?.postalCode,9).replace(/\D/g,"");
    if(cep.length!==8)return json({error:"CEP de destino inválido."},400);
    const items=Array.isArray(body.items)?body.items.slice(0,30):[];
    if(!items.length)return json({error:"Informe os produtos para cotação."},400);
    const variantIds=items.map(x=>text(x.variantId,80));
    if(variantIds.some(x=>!x)||new Set(variantIds).size!==variantIds.length)
      return json({error:"Itens inválidos ou repetidos para cotação."},400);
    const rows=await env.DB.prepare(`SELECT v.id,v.weight_grams,v.package_height_cm,v.package_width_cm,v.package_length_cm
      FROM product_variants v WHERE v.id IN (${variantIds.map(()=>"?").join(",")})`).bind(...variantIds).all();
    if((rows.results||[]).length!==new Set(variantIds).size)return json({error:"Produto inválido para cotação."},400);
    if(rows.results.some(v=>!v.weight_grams||!v.package_width_cm||!v.package_height_cm||!v.package_length_cm))return json({error:"Há produtos sem peso e dimensões cadastrados. O administrador deve completar a ficha logística antes de calcular o frete."},409);
    const products=items.map(it=>{const v=rows.results.find(x=>x.id===it.variantId);return {id:String(it.variantId),width:Number(v.package_width_cm),height:Number(v.package_height_cm),length:Number(v.package_length_cm),weight:Number(v.weight_grams)/1000,insurance_value:0,quantity:Math.max(1,Math.min(20,Number(it.quantity)||1))};});
    const payload={from:{postal_code:env.MELHORENVIO_FROM_POSTAL_CODE},to:{postal_code:cep},products};
    const response=await fetch(env.MELHORENVIO_API_URL || "https://melhorenvio.com.br/api/v2/me/shipment/calculate",{method:"POST",headers:{Authorization:`Bearer ${env.MELHORENVIO_TOKEN}`,"Content-Type":"application/json",Accept:"application/json","User-Agent":"WOG COMPUTER (comercial@wogcomputer.com.br)"},body:JSON.stringify(payload)});
    const result=await response.json().catch(()=>[]);
    if(!response.ok)return json({error:"Não foi possível cotar o frete neste momento."},502);
    return json({quotes:(Array.isArray(result)?result:[]).filter(x=>!x.error).map(x=>({id:x.id,name:x.name,company:x.company?.name||"",price:Number(x.custom_price??x.price),delivery_time:x.custom_delivery_time??x.delivery_time})).filter(x=>Number.isFinite(x.price)&&x.price>=0)});
  }

  // Checkout: preço e estoque sempre conferidos no D1; nenhum valor do navegador é confiado.
  if (path === "store/checkout" && method === "POST") {
    const body=await requireBody(request);
    if(!body)return json({error:"Dados inválidos."},400);
    if(!env.MP_ACCESS_TOKEN)return json({error:"Pagamento ainda não configurado. O administrador deve cadastrar as credenciais do Mercado Pago."},503);
    const customer=body.customer||{}, name=text(customer.name,160), email=text(customer.email,190).toLowerCase(), phone=text(customer.phone,30);
    if(!name||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!phone)return json({error:"Informe nome, e-mail e telefone válidos."},400);
    const method=["pix","credit_card"].includes(body.paymentMethod)?body.paymentMethod:"pix";
    const items=Array.isArray(body.items)?body.items.slice(0,30):[];
    if(!items.length)return json({error:"Carrinho vazio."},400);
    const ids=items.map(x=>text(x.variantId,80));
    if(ids.some(x=>!x)||new Set(ids).size!==ids.length)return json({error:"Itens inválidos ou repetidos."},400);
    const variants=await env.DB.prepare(`SELECT v.id,v.product_id,v.sku,v.price_cents,v.stock_quantity,v.reserved_quantity,v.is_active,
      p.name,p.status FROM product_variants v JOIN products p ON p.id=v.product_id
      WHERE v.id IN (${ids.map(()=>"?").join(",")})`).bind(...ids).all();
    if((variants.results||[]).length!==items.length)return json({error:"Um ou mais produtos não estão disponíveis."},409);
    let subtotal=0,normalized=[];
    for(const it of items){
      const v=variants.results.find(x=>x.id===it.variantId),qty=Math.max(1,Math.min(20,Math.floor(Number(it.quantity)||0)));
      if(!v||v.is_active!==1||v.status!=="ativo"||(v.stock_quantity-v.reserved_quantity)<qty||v.price_cents<=0)
        return json({error:`${v?.name||"Um produto"} está indisponível ou sem estoque suficiente.`},409);
      subtotal+=v.price_cents*qty;normalized.push({...v,quantity:qty,total:v.price_cents*qty});
    }
    let shipping=0,shippingMethod="pickup",address=null;
    if(body.shipping?.method==="melhor_envio"){
      if(!env.MELHORENVIO_TOKEN||!env.MELHORENVIO_FROM_POSTAL_CODE)return json({error:"Frete não configurado."},503);
      const cep=text(body.shipping.postalCode,9).replace(/\D/g,"");
      const quoteIds=normalized.map(x=>x.id);
      const quoteRows=await env.DB.prepare(`SELECT id,weight_grams,package_height_cm,package_width_cm,package_length_cm FROM product_variants WHERE id IN (${quoteIds.map(()=>"?").join(",")})`).bind(...quoteIds).all();
      if(quoteRows.results.some(v=>!v.weight_grams||!v.package_width_cm||!v.package_height_cm||!v.package_length_cm))return json({error:"Há produtos sem peso e dimensões cadastrados para envio."},409);
      const quoteProducts=normalized.map(x=>{const v=quoteRows.results.find(y=>y.id===x.id);return {id:x.id,width:Number(v.package_width_cm),height:Number(v.package_height_cm),length:Number(v.package_length_cm),weight:Number(v.weight_grams)/1000,insurance_value:x.price_cents/100,quantity:x.quantity};});
      const quoteResponse=await fetch(env.MELHORENVIO_API_URL || "https://melhorenvio.com.br/api/v2/me/shipment/calculate",{method:"POST",headers:{Authorization:`Bearer ${env.MELHORENVIO_TOKEN}`,"Content-Type":"application/json",Accept:"application/json","User-Agent":"WOG COMPUTER (comercial@wogcomputer.com.br)"},body:JSON.stringify({from:{postal_code:env.MELHORENVIO_FROM_POSTAL_CODE},to:{postal_code:cep},products:quoteProducts})});
      const quoteData=await quoteResponse.json().catch(()=>[]);
      const selected=(Array.isArray(quoteData)?quoteData:[]).find(x=>String(x.id)===String(body.shipping.serviceId)&&!x.error);
      if(!selected||!Number.isFinite(Number(selected.price)))return json({error:"Opção de frete inválida ou expirada. Faça nova cotação."},409);
      shipping=Math.round(Number(selected.custom_price??selected.price)*100);shippingMethod="melhor_envio";address=body.shipping.address||null;
    } else if(body.shipping?.method==="pickup"){shippingMethod="retirada";} else return json({error:"Selecione frete ou retirada na loja."},400);
    if(shippingMethod==="melhor_envio"&&(!address||!text(address.street,180)||!text(address.number,30)||!text(address.district,100)||!text(address.city,100)||!text(address.state,2)))return json({error:"Endereço de entrega incompleto."},400);
    const orderId=randomId(),orderNumber=`WOG-${new Date().toISOString().slice(2,10).replace(/-/g,"")}-${crypto.randomUUID().slice(0,6).toUpperCase()}`;
    const total=subtotal+shipping;
    const customerId=randomId(),paymentId=randomId();
    const statements=[
      env.DB.prepare("INSERT INTO customers(id,name,email,phone) VALUES(?,?,?,?)").bind(customerId,name,email,phone),
      env.DB.prepare(`INSERT INTO orders(id,customer_id,order_number,status,subtotal_cents,shipping_cents,total_cents,payment_status,shipping_method,shipping_address_json)
        VALUES(?,?,?,'pending_payment',?,?,?,'pending',?,?)`).bind(orderId,customerId,orderNumber,subtotal,shipping,total,shippingMethod,JSON.stringify(address||{}))
    ];
    for(const v of normalized){
      statements.push(env.DB.prepare("UPDATE product_variants SET reserved_quantity=reserved_quantity+? WHERE id=? AND (stock_quantity-reserved_quantity)>=?").bind(v.quantity,v.id,v.quantity));
      statements.push(env.DB.prepare("INSERT INTO order_items(id,order_id,variant_id,product_name_snapshot,sku_snapshot,quantity,unit_price_cents,total_cents) VALUES(?,?,?,?,?,?,?,?)")
        .bind(randomId(),orderId,v.id,v.name,v.sku,v.quantity,v.price_cents,v.total));
    }
    statements.push(env.DB.prepare("INSERT INTO payments(id,order_id,provider,method,status,amount_cents) VALUES(?,?,'mercadopago',?,'pending',?)").bind(paymentId,orderId,method,total));
    let reservationResults;
    try {
      reservationResults = await env.DB.batch(statements);
    } catch (error) {
      console.error("[WOG V5] Falha ao gravar pedido/reserva:", error?.stack || error);
      return json({error:"Não foi possível reservar o estoque. Atualize o carrinho e tente novamente."},409);
    }
    // UPDATE ... WHERE estoque_suficiente pode afetar zero linhas sem gerar erro SQL.
    // Conferimos cada UPDATE para impedir pedido com estoque não reservado.
    const failedReservation = normalized.some((item, index) =>
      !(reservationResults?.[2 + index * 2]?.meta?.changes > 0)
    );
    if (failedReservation) {
      const releases = normalized.map((item, index) => {
        const changed = reservationResults?.[2 + index * 2]?.meta?.changes > 0;
        return changed ? env.DB.prepare(
          "UPDATE product_variants SET reserved_quantity=MAX(0,reserved_quantity-?) WHERE id=?"
        ).bind(item.quantity, item.id) : null;
      }).filter(Boolean);
      if (releases.length) await env.DB.batch(releases);
      await env.DB.prepare("UPDATE orders SET status='stock_conflict',payment_status='failed',updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(orderId).run();
      return json({error:"O estoque mudou durante a finalização. Atualize o carrinho e tente novamente."},409);
    }
    const mpItems=normalized.map(v=>({id:v.id,title:v.name,quantity:v.quantity,currency_id:"BRL",unit_price:v.price_cents/100}));
    if(shipping>0)mpItems.push({id:"FRETE",title:"Frete",quantity:1,currency_id:"BRL",unit_price:shipping/100});
    const origin=url.origin;
    const pref={items:mpItems,external_reference:orderId,payer:{name,email,phone:{number:phone}},payment_methods:{excluded_payment_types:
       method==="pix"?[{id:"credit_card"},{id:"debit_card"},{id:"ticket"}]:
       method==="credit_card"?[{id:"ticket"},{id:"bank_transfer"}]:
       [{id:"credit_card"},{id:"debit_card"},{id:"bank_transfer"}],
       installments:method==="credit_card"?12:1},back_urls:{success:`${origin}/loja/obrigado/?pedido=${encodeURIComponent(orderNumber)}`,pending:`${origin}/loja/obrigado/?pedido=${encodeURIComponent(orderNumber)}`,failure:`${origin}/loja/checkout/?pedido=${encodeURIComponent(orderNumber)}`},auto_return:"approved",notification_url:`${origin}/api/payments/mercadopago/webhook`};
    let mp, mpData;
    try {
      mp=await fetch("https://api.mercadopago.com/checkout/preferences",{method:"POST",headers:{Authorization:`Bearer ${env.MP_ACCESS_TOKEN}`,"Content-Type":"application/json"},body:JSON.stringify(pref)});
      mpData=await mp.json().catch(()=>({}));
    } catch (error) {
      console.error("[WOG V5] Falha de comunicação com Mercado Pago:", error?.stack || error);
      await env.DB.prepare("UPDATE product_variants SET reserved_quantity=MAX(0,reserved_quantity-(SELECT quantity FROM order_items WHERE order_id=? AND variant_id=product_variants.id)) WHERE id IN (SELECT variant_id FROM order_items WHERE order_id=?)").bind(orderId,orderId).run();
      await env.DB.prepare("UPDATE orders SET status='payment_setup_error',payment_status='failed',updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(orderId).run();
      return json({error:"Não foi possível conectar ao Mercado Pago. A reserva de estoque foi liberada; tente novamente."},502);
    }
    if(!mp.ok||!mpData.init_point){
      await env.DB.prepare("UPDATE product_variants SET reserved_quantity=MAX(0,reserved_quantity-(SELECT quantity FROM order_items WHERE order_id=? AND variant_id=product_variants.id)) WHERE id IN (SELECT variant_id FROM order_items WHERE order_id=?)").bind(orderId,orderId).run();
      await env.DB.prepare("UPDATE orders SET status='payment_setup_error',payment_status='failed' WHERE id=?").bind(orderId).run();
      return json({error:"O gateway não conseguiu iniciar o pagamento. Nenhuma cobrança foi concluída."},502);
    }
    await env.DB.prepare("UPDATE payments SET raw_reference=?,provider_payment_id=? WHERE id=?").bind(mpData.id,mpData.id,paymentId).run();
    return json({ok:true,orderNumber,checkoutUrl:mpData.init_point});
  }

  if (path === "admin/logout" && method === "POST") {
  const user = await currentAdmin(request, env);
    if (user) {
      await env.DB.prepare("UPDATE admin_sessions SET revoked_at=CURRENT_TIMESTAMP WHERE id=?").bind(user.session_id).run();
      await audit(env, user.id, "logout", "admin_user", user.id, {}, request);
    }
    return json({ ok: true }, 200, { "set-cookie": cookie("", 0) });
  }
  if (path === "admin/session" && method === "GET") {
    const user = await currentAdmin(request, env);
    if (!user) return json({ authenticated: false });
    const { results = [] } = await env.DB.prepare(`SELECT p.module,p.action FROM user_roles ur
      JOIN role_permissions rp ON rp.role_id=ur.role_id JOIN permissions p ON p.id=rp.permission_id
      WHERE ur.user_id=? ORDER BY p.module,p.action`).bind(user.id).all();
    return json({ authenticated: true, user: { id:user.id,email:user.email,fullName:user.full_name }, permissions: results });
  }

  const user = await currentAdmin(request, env);
  if (!user) return json({ error: "Acesso não autorizado." }, 401);

  if (path === "admin/upload-signature" && method === "POST") {
    if (!await requirePermission(env,user,"products","update") &&
        !await requirePermission(env,user,"products","create"))
      return json({error:"Permissão insuficiente."},403);
    if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET)
      return json({error:"Cloudinary não configurado nos secrets do ambiente."},503);
    const body=await requireBody(request);
    const folder=text(body?.folder,180);
    if (!/^WOG-COMPUTER\/PRODUTOS\/[a-z0-9-]+(?:\/[a-z0-9-]+)?$/.test(folder))
      return json({error:"Pasta de upload inválida."},400);
    const timestamp=Math.floor(Date.now()/1000);
    const params={folder,timestamp,upload_preset:"wog_produtos_signed"};
    const signature=await cloudinarySignature(params,env.CLOUDINARY_API_SECRET);
    return json({cloudName:env.CLOUDINARY_CLOUD_NAME,apiKey:env.CLOUDINARY_API_KEY,
      timestamp,folder,uploadPreset:"wog_produtos_signed",signature});
  }

  // Categorias: consulta para formulários e navegação administrativa.
  if (path === "categories" && method === "GET") {
    if (!await requirePermission(env,user,"categories","view")) return json({error:"Permissão insuficiente."},403);
    const { results = [] } = await env.DB.prepare("SELECT id,parent_id,name,slug,description,image_url,sort_order,is_active FROM categories ORDER BY parent_id,sort_order,name").all();
    return json({ categories: results });
  }

  // Produtos: listagem com variante principal e imagem de capa.
  if (path === "products" && method === "GET") {
    if (!await requirePermission(env,user,"products","view")) return json({error:"Permissão insuficiente."},403);
    const { results = [] } = await env.DB.prepare(`SELECT p.id,p.name,p.slug,p.manufacturer,p.model,p.short_description,
      p.description,p.status,p.is_indexable,p.is_featured,p.category_id,
      CASE WHEN c.parent_id IS NULL THEN c.name ELSE pc.name || ' › ' || c.name END AS category,
      v.id AS variant_id,v.sku,v.price_cents,v.stock_quantity,v.allow_backorder,
      (SELECT image_url FROM product_images i WHERE i.product_id=p.id ORDER BY sort_order LIMIT 1) AS image_url
      FROM products p JOIN categories c ON c.id=p.category_id LEFT JOIN categories pc ON pc.id=c.parent_id
      LEFT JOIN product_variants v ON v.product_id=p.id ORDER BY p.created_at DESC LIMIT 1000`).all();
    return json({ products: results });
  }

  if (path === "products" && method === "POST") {
    if (!await requirePermission(env,user,"products","create")) return json({error:"Permissão insuficiente."},403);
    const body = await requireBody(request);
    if (!body) return json({error:"JSON inválido."},400);
    const name=text(body.name,180), categoryId=text(body.categoryId,80), subcategoryId=text(body.subcategoryId,80);
    const sku=text(body.sku,80).toUpperCase(), description=text(body.description,5000);
    const price=Math.round(Number(body.price)*100), costPrice=body.costPrice===''||body.costPrice==null?null:Math.round(Number(body.costPrice)*100), stock=Math.floor(Number(body.stock ?? 0));
    const weight=Math.round(Number(body.weightGrams||0)), height=Number(body.heightCm||0), width=Number(body.widthCm||0), length=Number(body.lengthCm||0);
    if (!name || !categoryId || !sku || !Number.isInteger(price) || price < 0 ||
        !Number.isInteger(stock) || stock < 0) return json({error:"Confira nome, categoria, SKU, preço e estoque."},400);
    const parent=await env.DB.prepare("SELECT id FROM categories WHERE id=? AND parent_id IS NULL AND is_active=1").bind(categoryId).first();
    if (!parent) return json({error:"Categoria principal inválida."},400);
    if (subcategoryId && !await env.DB.prepare("SELECT id FROM categories WHERE id=? AND parent_id=? AND is_active=1").bind(subcategoryId,categoryId).first())
      return json({error:"Subcategoria inválida."},400);
    const id=randomId(), variantId=randomId(), slug=`${slugify(name)}-${id.slice(0,8)}`;
    try {
      await env.DB.batch([
        env.DB.prepare(`INSERT INTO products(id,category_id,name,slug,manufacturer,model,short_description,description,condition,status,is_indexable)
          VALUES(?,?,?,?,?,?,?,?,?,?,0)`).bind(id,subcategoryId||categoryId,name,slug,text(body.brand,120),text(body.model,120),text(body.shortDescription,500),description,
            ["novo","usado","recondicionado"].includes(body.condition)?body.condition:"novo",
            ["rascunho","ativo","inativo","esgotado","arquivado","indisponivel"].includes(body.status)?body.status:"ativo"),
        env.DB.prepare(`INSERT INTO product_variants(id,product_id,sku,price_cents,cost_price_cents,stock_quantity,weight_grams,package_height_cm,package_width_cm,package_length_cm,manage_stock,allow_backorder,is_active)
          VALUES(?,?,?,?,?,?,?,?,?,?,1,0,1)`).bind(variantId,id,sku,price,costPrice,stock,weight||null,height||null,width||null,length||null)
      ]);
      const images = Array.isArray(body.images) ? body.images.slice(0,5) : [];
      for (let i=0;i<images.length;i++) {
        const im=images[i]||{};
        let parsed; try { parsed=new URL(im.url); } catch { continue; }
        if (parsed.protocol!=="https:" || parsed.hostname!=="res.cloudinary.com") continue;
        await env.DB.prepare("INSERT INTO product_images(product_id,image_url,public_id,alt_text,image_type,sort_order) VALUES(?,?,?,?,?,?)")
          .bind(id,parsed.href,text(im.publicId,255),text(im.alt||name,255),i===0?"cover":"gallery",i).run();
      }
      await audit(env,user.id,"product.create","product",id,{name,sku},request);
      return json({ok:true,id,slug},201);
    } catch(e) { return json({error:e.message?.includes("UNIQUE")?"SKU ou slug já cadastrado.":"Falha ao cadastrar produto."},400); }
  }

  const productMatch = path.match(/^products\/([a-f0-9-]+)$/i);
  if (productMatch && method === "PUT") {
    if (!await requirePermission(env,user,"products","update")) return json({error:"Permissão insuficiente."},403);
    const id=productMatch[1], body=await requireBody(request);
    if (!body) return json({error:"JSON inválido."},400);
    const existing=await env.DB.prepare("SELECT id,category_id FROM products WHERE id=?").bind(id).first();
    if (!existing) return json({error:"Produto não encontrado."},404);
    const name=text(body.name,180), description=text(body.description,5000);
    const price=Math.round(Number(body.price)*100), costPrice=body.costPrice===''||body.costPrice==null?null:Math.round(Number(body.costPrice)*100), stock=Math.floor(Number(body.stock));
    const weight=Math.round(Number(body.weightGrams||0)), height=Number(body.heightCm||0), width=Number(body.widthCm||0), length=Number(body.lengthCm||0);
    if (!name || !Number.isInteger(price) || price<0 || !Number.isInteger(stock) || stock<0)
      return json({error:"Nome, preço ou estoque inválido."},400);
    const categoryId=text(body.categoryId,80), subcategoryId=text(body.subcategoryId,80);
    const target=await env.DB.prepare("SELECT id FROM categories WHERE id=? AND parent_id IS NULL AND is_active=1").bind(categoryId).first();
    if (!target) return json({error:"Categoria principal inválida."},400);
    if (subcategoryId && !await env.DB.prepare("SELECT id FROM categories WHERE id=? AND parent_id=? AND is_active=1").bind(subcategoryId,categoryId).first())
      return json({error:"Subcategoria inválida."},400);
    const variant=await env.DB.prepare("SELECT id FROM product_variants WHERE product_id=? ORDER BY rowid LIMIT 1").bind(id).first();
    if (!variant) return json({error:"Variante não encontrada para o produto."},409);
    try {
      await env.DB.batch([
        env.DB.prepare(`UPDATE products SET category_id=?,name=?,manufacturer=?,model=?,short_description=?,description=?,status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`)
          .bind(subcategoryId||categoryId,name,text(body.brand,120),text(body.model,120),text(body.shortDescription,500),description,
            ["rascunho","ativo","inativo","esgotado","arquivado","indisponivel"].includes(body.status)?body.status:"ativo",id),
        env.DB.prepare("UPDATE product_variants SET price_cents=?,cost_price_cents=?,stock_quantity=?,weight_grams=?,package_height_cm=?,package_width_cm=?,package_length_cm=?,allow_backorder=0 WHERE id=?").bind(price,costPrice,stock,weight||null,height||null,width||null,length||null,variant.id)
      ]);
      if (Array.isArray(body.images)) {
        await env.DB.prepare("DELETE FROM product_images WHERE product_id=?").bind(id).run();
        for (let i=0;i<body.images.slice(0,5).length;i++) {
          const im=body.images[i]||{}; let parsed; try { parsed=new URL(im.url); } catch { continue; }
          if (parsed.protocol!=="https:" || parsed.hostname!=="res.cloudinary.com") continue;
          await env.DB.prepare("INSERT INTO product_images(product_id,image_url,public_id,alt_text,image_type,sort_order) VALUES(?,?,?,?,?,?)")
            .bind(id,parsed.href,text(im.publicId,255),text(im.alt||name,255),i===0?"cover":"gallery",i).run();
        }
      }
      await audit(env,user.id,"product.update","product",id,{name},request);
      return json({ok:true});
    } catch { return json({error:"Falha ao atualizar produto."},400); }
  }
  if (productMatch && method === "DELETE") {
    if (!await requirePermission(env,user,"products","delete")) return json({error:"Permissão insuficiente."},403);
    const id=productMatch[1];
    const result=await env.DB.prepare("UPDATE products SET status='arquivado',is_indexable=0,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(id).run();
    if (!result.meta?.changes) return json({error:"Produto não encontrado."},404);
    await audit(env,user.id,"product.archive","product",id,{},request);
    return json({ok:true,message:"Produto arquivado; os registros foram preservados."});
  }

  if (path === "admin/users" && method === "GET") {
    if (!await requirePermission(env,user,"users","view")) return json({error:"Permissão insuficiente."},403);
    const {results=[]}=await env.DB.prepare(`SELECT u.id,u.email,u.full_name,u.status,u.last_login_at,u.created_at,
      GROUP_CONCAT(r.name, ', ') AS roles FROM admin_users u LEFT JOIN user_roles ur ON ur.user_id=u.id
      LEFT JOIN roles r ON r.id=ur.role_id GROUP BY u.id ORDER BY u.created_at DESC`).all();
    return json({users:results});
  }
  if (path === "admin/users" && method === "POST") {
    if (!await requirePermission(env,user,"users","create")) return json({error:"Permissão insuficiente."},403);
    const body=await requireBody(request);
    if (!body) return json({error:"JSON inválido."},400);
    const email=text(body.email,190).toLowerCase(), fullName=text(body.fullName,160), password=String(body.password||"");
    const roleId=text(body.roleId,80);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!fullName||password.length<12||!roleId)
      return json({error:"Informe nome, e-mail válido, senha de pelo menos 12 caracteres e perfil."},400);
    const role=await env.DB.prepare("SELECT id FROM roles WHERE id=?").bind(roleId).first();
    if (!role) return json({error:"Perfil não encontrado."},404);
    const id=randomId();
    try {
      await env.DB.batch([
        env.DB.prepare("INSERT INTO admin_users(id,email,full_name,password_hash,status,password_changed_at) VALUES(?,?,?,?, 'active',CURRENT_TIMESTAMP)")
          .bind(id,email,fullName,await passwordHash(password)),
        env.DB.prepare("INSERT INTO user_roles(user_id,role_id) VALUES(?,?)").bind(id,roleId)
      ]);
      await audit(env,user.id,"user.create","admin_user",id,{email,roleId},request);
      return json({ok:true,id},201);
    } catch(e) { return json({error:e.message?.includes("UNIQUE")?"Este e-mail já está cadastrado.":"Falha ao criar usuário."},400); }
  }
  const userMatch=path.match(/^admin\/users\/([a-f0-9-]+)$/i);
  if (userMatch && method === "PATCH") {
    if (!await requirePermission(env,user,"users","update")) return json({error:"Permissão insuficiente."},403);
    const id=userMatch[1], body=await requireBody(request);
    if (!body || id===user.id) return json({error:"Não é possível alterar a própria conta por esta rota."},400);
    const status=["active","blocked","invited"].includes(body.status)?body.status:null;
    if (!status) return json({error:"Status inválido."},400);
    const result=await env.DB.prepare("UPDATE admin_users SET status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(status,id).run();
    if (!result.meta?.changes) return json({error:"Usuário não encontrado."},404);
    if (status!=="active") await env.DB.prepare("UPDATE admin_sessions SET revoked_at=CURRENT_TIMESTAMP WHERE user_id=? AND revoked_at IS NULL").bind(id).run();
    await audit(env,user.id,"user.status.update","admin_user",id,{status},request);
    return json({ok:true});
  }
  if (path === "admin/roles" && method === "GET") {
    if (!await requirePermission(env,user,"roles","view")) return json({error:"Permissão insuficiente."},403);
    const {results=[]}=await env.DB.prepare(`SELECT r.id,r.name,r.description,r.is_system,
      GROUP_CONCAT(p.module || ':' || p.action, ', ') AS permissions
      FROM roles r LEFT JOIN role_permissions rp ON rp.role_id=r.id
      LEFT JOIN permissions p ON p.id=rp.permission_id GROUP BY r.id ORDER BY r.name`).all();
    return json({roles:results});
  }
  if (path === "admin/audit" && method === "GET") {
    if (!await requirePermission(env,user,"audit","view")) return json({error:"Permissão insuficiente."},403);
    const limit=Math.min(200,Math.max(1,Number(url.searchParams.get("limit")||100)));
    const {results=[]}=await env.DB.prepare(`SELECT a.id,a.action,a.entity_type,a.entity_id,a.details_json,a.created_at,u.email,u.full_name
      FROM audit_logs a LEFT JOIN admin_users u ON u.id=a.actor_user_id ORDER BY a.created_at DESC LIMIT ?`).bind(limit).all();
    return json({logs:results});
  }

  return json({error:"Rota não encontrada."},404);
}
export async function onRequest(context) {
  try { return await route(context.request,context.env); }
  catch (error) {
    // Detalhes ficam somente nos logs do Cloudflare; nunca são enviados ao navegador.
    console.error("[WOG V5 API] Falha não tratada:", {
      method: context.request.method,
      path: new URL(context.request.url).pathname,
      message: error?.message || String(error),
      stack: error?.stack || null
    });
    return json({error:"Erro interno ao processar a solicitação."},500);
  }
}
