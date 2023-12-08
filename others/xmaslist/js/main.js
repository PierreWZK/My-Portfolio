$(document).ready(function () {


    let $btns = $('.project-area .button-group button');


    $btns.click(function (e) {

        $('.project-area .button-group button').removeClass('active');
        e.target.classList.add('active');

        let selector = $(e.target).attr('data-filter');
        $('.project-area .grid').isotope({
            filter: selector
        });

        return false;
    })

    $('.project-area .button-group #btn1').trigger('click');

    $('.project-area .grid .test-popup-link').magnificPopup({
        type: 'image',
        gallery: { enabled: true }
    });


    // Owl-carousel

    $('.site-main .about-area .owl-carousel').owlCarousel({
        loop: true,
        autoplay: true,
        dots: true,
        responsive: {
            0: {
                items: 1
            },
            560: {
                items: 2
            }
        }
    })

    // sticky navigation menu

    let nav_offset_top = $('.header_area').height() + 50;

    function navbarFixed() {
        if ($('.header_area').length) {
            $(window).scroll(function () {
                let scroll = $(window).scrollTop();
                if (scroll >= nav_offset_top) {
                    $('.header_area .main-menu').addClass('navbar_fixed');
                } else {
                    $('.header_area .main-menu').removeClass('navbar_fixed');
                }
            })
        }
    }

    navbarFixed();

    function setCategoryItems() {
        var divCategory = document.querySelectorAll('.category');

        divCategory.forEach(element => {
            // Vider element
            element.innerHTML = "";

            // Récupérer les class du parent, du parent, du parent
            var category = element.parentElement.parentElement.parentElement.classList;
            // category.remove(category[0], category[1], category[2], category[3]);

            var textCategory = "";
            category.forEach(elementCategory => {
                textCategory += " " + translateCategory(elementCategory);
            });
            textCategory = textCategory.substring(1);
            textCategory = textCategory.substring(0, textCategory.length-1)

            element.innerHTML = textCategory;
        });
    }

    function translateCategory(categoryClass) {
        var text = "";
        switch (categoryClass) {
            case "popular":
                text = "Preféré,"
                break;
            case "accessory":
                text = "Accessoire,"
                break;
            case "services":
                text = "Service,"
                break;
            case "livres":
                text = "Livre,"
                break;
            case "manga":
                text = "Manga,"
                break;
            case "casques":
                text = "Casque,"
                break;
            case "cd":
                text = "CD,"
                break;
            case "montres":
                text = "Montre,"
                break;
            case "travail":
                text = "Travail,"
                break;
            case "jeu":
                text = "Jeu,"
                break;
            case "deco":
                text = "Déco,"
                break;
        }
        return text;
    }

    setCategoryItems();

});