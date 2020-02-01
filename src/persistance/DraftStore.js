
export default class DraftStore {

  static set (key, value) {
    var date = new Date()
    date.setTime(date.getTime() + 7*24*3600*1000);
    Cookies.set('draft-'+key, value, { path: '/', expires: date })
  }

  static get (key) {
    return Cookies.get('draft-'+key)
  }

  static remove (key) {
    Cookies.remove('draft-'+key, { path: '/' })
  }

}




