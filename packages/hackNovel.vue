<script setup lang="ts">
import { onMounted, ref } from 'vue'
import FileSaver from 'file-saver';

const index = ref(265)
onMounted(() => {
  getFile(index.value)
})

function getFile(number) {
    function transForm(text) {
      let stringHtml = text
      let codeHtml = new DOMParser().parseFromString(stringHtml, 'text/html');
      console.log(codeHtml)
      const content = codeHtml.getElementsByClassName('content')[0]
      var blob = new Blob([content.innerHTML.replaceAll('/book/146998', '.')], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, `${number}.html`);
    }
    const myHeaders = new Headers();
    myHeaders.append("Pragma", "no-cache");
    myHeaders.append("Sec-Fetch-User", "?1");
    myHeaders.append("Upgrade-Insecure-Requests", "1");
    myHeaders.append("Cookie", "Hm_lvt_b147be33903fb4b5cd5f16843ab81a1d=1714009377; hm=2b2912466a29d618fc0cf9d58bec33dd; Hm_lpvt_b147be33903fb4b5cd5f16843ab81a1d=1714010499");
    myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
    myHeaders.append("Accept", "*/*");
    myHeaders.append("Host", "www.bigee.cc");
    myHeaders.append("Connection", "keep-alive");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`https://www.bigee.cc/book/146998/${number}.html`, requestOptions)
      .then(response => response.text())
      .then(result => transForm(result))
      .catch(error => console.log('error', error));
}
</script>

<template>

</template>

