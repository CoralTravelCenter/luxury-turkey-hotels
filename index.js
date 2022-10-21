const page = document.querySelector(".exclusive-hotels");
const submenu = page.querySelector(".submenu");
const closeButton = submenu.querySelector(".submenu__close-button");
const menuButton = page.querySelector(".hotels__burger");
const submenuItems = submenu.querySelectorAll(".submenu__navitem");
const sliderContainer = page.querySelector(".hotels");
let slideID, firstSlideID;

const hotels = new Swiper(".hotels__slider", {
	autoplay: {
		delay: 3e4,
	},
	slidesPerView: 1,
	centeredSlides: true,
	spaceBetween: 0,
	loop: true,
	loopedSlides: 17,
});

const hotelsLogos = new Swiper(".hotels__logos", {
	slidesPerView: 3,
	loopedSlides: 17,
	centeredSlides: false,
	loop: true,
	slideToClickedSlide: true,
	navigation: {
		nextEl: ".swiper-button-next",
		prevEl: ".swiper-button-prev",
	},
	breakpoints: {
		769: {
			slidesPerView: 5,
		},
		1399: {
			slidesPerView: 7,
		}
	},
});

const slides = sliderContainer.querySelectorAll(".hotels__slide");
const hotelsLogosImgs = sliderContainer.querySelectorAll(".hotels__logo-wrapper");

menuButton.addEventListener("click", () => {
	openMenu();
	ym(553380, "reachGoal", "menu");
});

closeButton.addEventListener("click", closeMenu);

hotelsLogosImgs.forEach((logo) => {
	const logoAlt = logo.querySelector(".hotels__logo").alt;
	logo.addEventListener("click", () => {
		ym(553380, "reachGoal", "logo", { hotel_name_luxury_logo: `${logoAlt.toLowerCase()}` });
	});
});
slides.forEach((slide) => {
	const slideBtn = slide.querySelector(".hotels__button");
	const slideTitle = slide.querySelector(".hotels__title");
	slideBtn.addEventListener("click", () => {
		ym(553380, "reachGoal", "choosenumber", { hotel_name_luxury_chooserum: `${slideTitle.textContent.toLowerCase()}` });
	});
});

hotels.controller.control = hotelsLogos;
hotelsLogos.controller.control = hotels;

function openMenu() {
	submenu.classList.add("submenu_opened");
	document.addEventListener("scroll", scrollHandler);
}

function closeMenu() {
	submenu.classList.remove("submenu_opened");
	document.removeEventListener("scroll", scrollHandler);
}

function scrollHandler() {
	if (submenu.classList.contains("submenu_opened")) {
		closeMenu();
	}
}

const videos = page.querySelectorAll(".hotels__video");
const players = [];

videos.forEach((video) => {
	if (video.classList.contains("hotels__video-fake")) {
		players.push(video);
	} else {
		players.push(new Vimeo.Player(video));
	}
});

submenuItems.forEach((item) => {
	item.addEventListener("click", () => {
		hotels.slideToLoop(Number(item.id), 1000, false);
		initSlideID();
		removeCover(players[slideID]);
		closeMenu();
		ym(553380, "reachGoal", "menu1", { hotel_name_luxury_menu: `${item.textContent.toLowerCase()}` });
	});
});

function initSlideID() {
	hotels.updateActiveIndex();
	slideID = hotels.activeIndex;
	if (slideID < 0) {
		slideID = 0;
	}
}
function removeCover(player) {
	if (!player.element) {
		console.log(`No video to play on slide ${slideID}`);
		return;
	}
	if (player.element.dataset.ready) {
		player.play();
		console.log(`Command to play video from ${slideID} slide`);
		videos[slideID].previousElementSibling.classList.add("hotels__video-cover_hidden");
		console.log(`Video started. Remove cover from ${slideID} slide`);
	} else {
		player.play();
		console.log(`Command to play video from ${slideID} slide`);
		player.on("bufferstart", () => {
			console.log(`Video from ${slideID} slide is buffering...`);
			player.on("bufferend", () => {
				console.log(`Video from ${slideID} slide has buffered`);
				player.getPaused().then((paused) => {
					if (!paused) {
						console.log(`Video started. Remove cover from ${slideID} slide`);
						videos[slideID].previousElementSibling.classList.add("hotels__video-cover_hidden");
					}
				});
			});
		});
	}
}

function pauseVideo(player) {
	if (!player.element) {
		console.log(`No video to pause on slide ${slideID}`);
		return;
	}
	player.pause();
	console.log(`Command to pause video from ${slideID} slide`);
	player.getPaused().then((paused) => {
		if (paused) {
			videos[slideID].previousElementSibling.classList.remove("hotels__video-cover_hidden");
			console.log(`Video paused. Back cover to ${slideID} slide`);
		}
	});
}

document.addEventListener("DOMContentLoaded", () => {
	initSlideID();
	console.log(`Started from ${slideID} slide`);
	removeCover(players[slideID]);
});

hotels.on("slideChangeTransitionStart", () => {
	console.log(`Changing from ${slideID} slide`);
	pauseVideo(players[slideID]);
});

hotels.on("slideChangeTransitionEnd", () => {
	initSlideID();
	console.log(`Changed to ${slideID} slide`);
	removeCover(players[slideID]);
});
