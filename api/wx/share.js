import router from "../../router/router.js";

const getShareInfo = (title, pathRoute, imageUrl) => {
  pathRoute = pathRoute || "index";
  return {
    title: title || '共享推车',
    imageUrl: imageUrl || "/assets/img/babyCart/baby-cart.png",
    path: router.getRoute(pathRoute)
  }
}

module.exports = {
  getShareInfo
}