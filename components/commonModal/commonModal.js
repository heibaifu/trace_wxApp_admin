// components/commonModal/commonModal.js
const classEunm = {
  center: "position_center",
  top: "position_top",
  bottom: "position_bottom"
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal, changedPath) {
        if (newVal) {
          this.showModal();
        } else {
          this.hideModal();
        }
      }
    },
    position: {
      type: String,
      value: "center"

    }
  },
  attached() {
    this.setData({
      positionClassName: classEunm[this.data.position || "center"]
    })
  },
  /**
   * 组件的初始数据
   */
  data: {
    positionClassName: classEunm["center"]
  },

  /**
   * 组件的方法列表
   */
  methods: {

    showModal() {
      // 显示遮罩层
      let animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: true
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200)
    },

    hideModal() {
      // 隐藏遮罩层
      let animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export(),
          showModalStatus: false
        })
        this.triggerEvent('hideModal')
      }.bind(this), 200)
    }
  }
})