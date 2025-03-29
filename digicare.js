

// Script para manejar la navegación suave entre secciones
document.addEventListener('DOMContentLoaded', function() {
    // Obtener todos los enlaces del menú de navegación
    const menuLinks = document.querySelectorAll('.menu a');
    
    // Agregar event listener a cada enlace
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener el ID de la sección a la que apunta el enlace
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Desplazamiento suave a la sección
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
        });
    });
    
    // Manejar el envío del formulario de contacto
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener valores del formulario
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const telefono = document.getElementById('telefono').value;
            const mensaje = document.getElementById('mensaje').value;
            
            // Aquí normalmente enviarías los datos a un servidor
            // Por ahora, mostramos un mensaje de confirmación
            alert(`¡Gracias ${nombre} por contactarnos! Te responderemos pronto.`);
            
            // Resetear el formulario
            contactForm.reset();
        });
    }
    
    // Animación para las tarjetas de servicios
    const servicioCards = document.querySelectorAll('.servicio-card');
    
    // Función para verificar si un elemento está en el viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Función para animar elementos cuando son visibles
    function animateOnScroll() {
        servicioCards.forEach(card => {
            if (isInViewport(card) && !card.classList.contains('animated')) {
                card.classList.add('animated');
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Inicializar estilos para animación
    servicioCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Ejecutar animación en carga y al hacer scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
    
    // CTA Button Hover Effect
    const ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        ctaButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        ctaButton.style.transition = 'transform 0.3s ease, background-color 0.3s';
    }
    
    // Efectos para enlaces de redes sociales
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.textDecoration = 'underline';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.textDecoration = 'none';
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const servicioCards = document.querySelectorAll(".servicio-card");

    servicioCards.forEach(card => {
        card.addEventListener("click", function() {
            const servicio = this.querySelector("h3").innerText; 
            const numeroWhatsApp = "50254249388"; // Número de WhatsApp actualizado
            const mensaje = `¡Hola! Estoy interesado en el servicio de ${servicio}. ¿Podrían darme más información?`;
            const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

            window.open(url, "_blank");
        });
    });
});

