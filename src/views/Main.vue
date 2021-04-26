<template>
  <div class="background">
    <grid-layout :layout.sync="layout" is-draggable is-resizable :margin="[0, 0]" responsive autoSize>
      <grid-item
        v-for="item in layout"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :key="item.i"
        drag-allow-from=".vue-draggable-handle"
        drag-ignore-from=".no-drag"
      >
        <Feed :options="item.options" />
      </grid-item>
    </grid-layout>
    <SlidePanel>
      <FeedManager />
    </SlidePanel>
  </div>
</template>

<script>
  import VueGridLayout from "vue-grid-layout";

  import Feed from "@/components/Feed";
  import SlidePanel from "@/components/SlidePanel";
  import FeedManager from "@/components/FeedManager";

  export default {
    name: "Main",
    components: {
      Feed,
      SlidePanel,
      FeedManager,
      GridLayout: VueGridLayout.GridLayout,
      GridItem: VueGridLayout.GridItem
    },
    data: () => {
      const sources = [
        "https://f1prodvod.akamaized.net/out/v1/473c63e75ebf41888cc58c168e3d9da6/33957307c5b848a6bea693bb400a7166/e4d49ef8077f4032a097e2b0c8a962bb/index.m3u8?hdnea=st=1619381275~exp=1619381575~acl=/out/v1/473c63e75ebf41888cc58c168e3d9da6/*~hmac=0b6755c3caf6a8cf446f80c32a36ae1cda604e6c7be675d977a6f174dadb258a",
        "https://f1prodvod.akamaized.net/out/v1/53f49cf136074f3ca22ebcbd7e9a5b70/33957307c5b848a6bea693bb400a7166/e4d49ef8077f4032a097e2b0c8a962bb/index.m3u8?hdnea=st=1619381365~exp=1619381665~acl=/out/v1/53f49cf136074f3ca22ebcbd7e9a5b70/*~hmac=251fbe73589e8186b11566835d76a93dbd620b5430365d7dd2dc839cd18dcf8e",
        "https://f1prodvod.akamaized.net/out/v1/9ae96c87b5114d889133d58fe6595318/33957307c5b848a6bea693bb400a7166/e4d49ef8077f4032a097e2b0c8a962bb/index.m3u8?hdnea=st=1619381371~exp=1619381671~acl=/out/v1/9ae96c87b5114d889133d58fe6595318/*~hmac=f8181c3097c811c6dc7d8685a498ed4b27c7faa74eb120a82a8402446ecd8223",
        "https://f1prodvod.akamaized.net/out/v1/6047783cc5ed4e50be9f5fa63a20b424/33957307c5b848a6bea693bb400a7166/e4d49ef8077f4032a097e2b0c8a962bb/index.m3u8?hdnea=st=1619381378~exp=1619381678~acl=/out/v1/6047783cc5ed4e50be9f5fa63a20b424/*~hmac=9eeef2f58b7c9a79c6c21725d596c8392220debdf4c95501ca5b5ead6f5539b7",
        "https://f1prodvod.akamaized.net/out/v1/07bccb0d5ddf42f7bb78b46edc0cb346/33957307c5b848a6bea693bb400a7166/e4d49ef8077f4032a097e2b0c8a962bb/index.m3u8?hdnea=st=1619381386~exp=1619381686~acl=/out/v1/07bccb0d5ddf42f7bb78b46edc0cb346/*~hmac=34ed2747920fd3db098ab31bf2b9bec7e7d23ccfdba8b8f20d70d18c51cf13b2",
        "https://f1prodvod.akamaized.net/out/v1/eed128733d624caf952786fd5e3c449b/33957307c5b848a6bea693bb400a7166/e4d49ef8077f4032a097e2b0c8a962bb/index.m3u8?hdnea=st=1619381393~exp=1619381693~acl=/out/v1/eed128733d624caf952786fd5e3c449b/*~hmac=d0f4640a1984557e791f3e351c8974143a5a903b5df8c62b9a343370e648f014"
      ];

      const layout = [];

      for (let i = 0; i < sources.length; i++) {
        const obj = {
          x: i,
          y: 0,
          w: 1,
          h: 1,
          i,
          options: {
            controls: true,
            preload: "auto",
            sources: [
              {
                src: sources[i]
              }
            ]
          }
        };

        layout.push(obj);
      }

      return { layout };
    }
  };
</script>

<style lang="scss" scoped>
  .vue-grid-item {
    background: #f5f5f5;
  }

  .background {
    min-height: 100vh;
    background: #fdfdfd;
  }

  @media all and (display-mode: fullscreen) {
    .background {
      background: black;
    }
  }
</style>
