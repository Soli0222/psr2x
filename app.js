const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config()
const { IFTTT_TEXT } = process.env

const app = express();
const port = 8124; // 使用するポートを指定

// JSONパースミドルウェアを設定
app.use(bodyParser.json());

// Webhookのエンドポイントを作成
app.post('/', (req, res) => {
  const data = req.body; // Webhookからのデータ
  let modifiedData;
  let ifttt_url;

    if (data.body.note.visibility === "public" && data.body.note.localOnly === false) {
        
        if (data.body.note.files.length === 0) {
            modifiedData = {
                value1: data.body.note.text,
                value2: data.server + "/notes/" + data.body.note.id,
              };
            ifttt_url = IFTTT_TEXT
        }

        /*
        画像を乗っけてポストしたいが、Webpに対応していない雰囲気があるのでやめた
        一応コードを残しておく

        else {
            modifiedData = {
                value1: data.body.note.text,
                value2: data.server + "/notes/" + data.body.note.id,
                value3: data.body.note.files[0].url,
            }
            ifttt_url = "https://maker.ifttt.com/trigger/psr2x_image/with/key/cWX8La2deF83G4AebUx9CO"
        }
        */

        // データを処理するコードをここに追加
        postIFTTT(ifttt_url,modifiedData)
    }

  res.sendStatus(200); // 応答コード 200 OK
});

app.listen(port, () => {
  console.log(`Webhookサーバーがポート ${port} で実行中...`);
});

function postIFTTT(url, modifiedData) {
    axios.post(url, modifiedData, {
        headers: {
          'Content-Type': 'application/json', // JSONデータを送信するためにContent-Typeを設定
        },
      })
        .then(response => {
          console.log('[OK]',modifiedData);
        })
        .catch(error => {
          console.error('[ERR]',modifiedData, error);
        });
}