const filters=document.querySelectorAll(".filters button"),cards=document.querySelectorAll(".courses article");
filters.forEach(b=>b.addEventListener("click",()=>{filters.forEach(x=>x.classList.remove("active"));b.classList.add("active");cards.forEach(c=>c.style.display=b.dataset.filter==="all"||c.dataset.cat===b.dataset.filter?"block":"none")}));
function openLogin(){show("Área del estudiante","La interfaz de cuenta está preparada. La activación de usuarios, autenticación y pagos se conectará al backend seguro antes del lanzamiento comercial.")}
function course(id){show(id+" · Vista del curso","La ficha y experiencia del curso están preparadas para conectar video-lecciones, PDFs, ejercicios, evaluación y progreso del estudiante.")}
function plan(name){show("Plan "+name,"La selección comercial está preparada. El cobro recurrente se activará cuando se conecte el proveedor de pagos y se confirmen los precios finales.")}
function show(t,p){document.getElementById("modalTitle").textContent=t;document.getElementById("modalText").textContent=p;document.getElementById("modal").classList.add("show")}
function closeModal(){document.getElementById("modal").classList.remove("show")}
function growth(name){show(name+" · Fase 4","Este módulo forma parte de la expansión de PLUTÓN ACADEMIC. La experiencia visual ya está integrada; las funciones que requieren cuentas, notificaciones, comunidad o app nativa se conectarán con servicios seguros durante la implementación operativa.")}
