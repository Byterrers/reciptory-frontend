import * as moment from 'moment';

export class Utils {
  public static async dataURLtoFile(dataUrl, filename) {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return await new File([u8arr], filename, { type: mime });
  }

  public static arrayToMatrix(a = [], w = 3): any {
    return a.reduce(
      (rows, key, index) =>
        (index % w === 0
          ? rows.push([key])
          : rows[rows.length - 1].push(key)) && rows,
      []
    );
  }

  public static checkExpirationDate(date: string) {
    const now = moment();
    const expDate = moment(new Date(date));
    const daysDiff = expDate.diff(now, 'days') + 1;

    if (daysDiff <= 0) {
      return -1;
    } else if (daysDiff <= 5) {
      return 0;
    } else {
      return 1;
    }
  }
}
