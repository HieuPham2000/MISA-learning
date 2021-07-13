class CommonFunction {

  /**
   * Định dạng dữ liệu lấy từ loadData, nếu null hoặc undefined thì trả về ""
   * @param {*} data 
   * @returns {*} data hoặc ""
   * @author pthieu (06-07-2021)
   */
  static formatData(data) {
    if (data == null || data == undefined) {
      return "";
    }
    return data;
  }

  /** 
   * Format dữ liệu ngày tháng theo định dạng dd/mm/yyyy
   * @param {string} date dữ liệu thời gian lấy từ API
   * @returns {string} xâu định dạng ngày tháng dd/mm/yyyy
   * @author pthieu (05-07-2021)
   */
  static formatDateDDMMYYYY(date) {
    if (!date) {
      return '';
    }
    let dateOrigin = new Date(date);

    let d = dateOrigin.getDate();
    d = d > 9 ? d : `0${d}`;
    let m = dateOrigin.getMonth() + 1; // tháng bắt đầu từ 0
    m = m > 9 ? m : `0${m}`;
    let y = dateOrigin.getFullYear();
    let dateString = `${d}/${m}/${y}`;
    return dateString;
  }

  /** 
   * Format dữ liệu ngày tháng theo định dạng yyyy-mm-dd
   * @param {string} date dữ liệu thời gian lấy từ API
   * @returns {string} xâu định dạng ngày tháng yyyy-mm-dd
   * @author pthieu (05-07-2021)
   */
  static formatDateYYYYMMDD(date) {
    if (!date) {
      return '';
    }
    let dateOrigin = new Date(date);

    let d = dateOrigin.getDate();
    d = d > 9 ? d : `0${d}`;
    let m = dateOrigin.getMonth() + 1; // tháng bắt đầu từ 0
    m = m > 9 ? m : `0${m}`;
    let y = dateOrigin.getFullYear();
    let dateString = `${y}-${m}-${d}`;
    return dateString;
  }

  /**
   * Định dạng tiền lương theo dạng xxx.xxx.xxx
   * @param {number} salary giá trị tiền lương
   * @returns {string} xâu định dang xxx.xxx.xxx
   * @author pthieu (06-07-2021)
   */
  static formatMoney(salary) {
    return salary ? salary.toLocaleString("it-IT") : "";
  }

  /**
   * Chuyển giá trị work status dạng số sang xâu mô tả tương ứng
   * @param {number} code 
   * @returns {string} xâu mô tả
   * @author pthieu (06-07-2021)
   */
  static formatWorkStatus(code) {
    const code1 = "Đã nghỉ việc";
    const code2 = "Đang thử việc";
    const code3 = "Đang làm việc";
    switch (code) {
      case 1:
        return code1;
      case 2:
        return code2;
      case 3:
        return code3;
      default:
        return "";
    }
  }

  /**
   * Loại bỏ dấu tiếng Việt trong xâu
   * @param {string} str xâu cần loại bỏ dấu tiếng Việt
   * @returns {string} xâu đã loại bỏ bỏ dấu tiếng Việt
   * @author pthieu (08-07-2021)
   */
  static nonAccentVietnamese(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
  }

  /**
   * Thêm thẻ \<strong\> cho thông báo
   * 
   * @param {string} msg Nội dung thông báo
   * @returns Xâu đã được chỉnh sửa
   * @author pthieu (08-07-2021)
   */
  static decoString(msg) {
    var first = msg.indexOf('"');
    var last = msg.lastIndexOf('"');
    if(first > -1) {
      msg = `${msg.slice(0, first)}<strong>${msg.slice(first, last + 1)}</strong>${msg.slice(last + 1)}`;
    }
    return msg;
  }
}