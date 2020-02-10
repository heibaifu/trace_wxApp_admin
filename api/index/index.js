import baseHttpProvider from '../base/baseHttpProvider';
const getWorkOrder = (params) => {
  return baseHttpProvider.getApi('api/operationHome/getWorkOrder', {   
    ...params
  }, {
      showLoading: true
  })
}
module.exports = {
  getWorkOrder
}