import {
  apiUrlPrefix, picUrlPrefix
} from '../../config/http.config.js'
import Toast from "../../utils/toast.js";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalInfo: {
      type: Object,
      value: false,
      observer: function(newVal, oldVal, changedPath) {

        if (newVal && newVal.show && (newVal.phoneNumber || newVal.username)) {
          if (newVal.phoneNumber) {
            this.setData({
              phoneNumber: newVal.phoneNumber,
              username: null
            })
          }
          if (newVal.username) {
            this.setData({
              username: newVal.username,
              phoneNumber: null
            })
          }

          this.showModal();

        } else {
          this.hideModal();
        }
      }
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    verifyImageCode: null,
    phoneNumber: null,
    showModalStatus: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeVerifyImage() {

      let numberStr = '';
      if (this.data.phoneNumber) {
        numberStr = `phoneNumber=${this.data.phoneNumber}`
      }
      if (this.data.username) {
        numberStr = `username=${this.data.username}`
      }

      let verifyImage = `${apiUrlPrefix}frnImageCaptcha?${numberStr}&stamp=${Date.now()}`
      this.setData({
        verifyImage: verifyImage
      })
    },

    // 获取图片验证码的值
    getVerifyImageCodeVal(e) {
      let data = {
        verifyImageCode: e.detail.value
      }
      this.setData(data);
    },
    confirmImageCode() {
      let code = this.data.verifyImageCode;
      if (!code || !(/^[0-9a-zA-Z]{4}$/.test(code))) {
        Toast("请输入正确的图片验证码！");
        return;
      }
      this.triggerEvent("submitImageCode", {
        imageCode: this.data.verifyImageCode
      });
      this.hideModal();
    },

    showModal() {
      // 显示遮罩层
      this.changeVerifyImage();
      this.setData({
        showModalStatus: true
      })
    },

    hideModal() {
      // 隐藏遮罩层
      this.setData({
        showModalStatus: false
      })
    }
  }
})