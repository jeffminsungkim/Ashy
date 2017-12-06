import { Camera } from '@ionic-native/camera';

export class CameraMock extends Camera {

  getPicture(options) {
    let base64Image =`data:image/jpeg;base64,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
        Ip6DsFv40m419GDlRSkn9npERaTKf/2Q==`;
        return new Promise((resolve, reject) => {
          resolve(base64Image);
        });
  }
}