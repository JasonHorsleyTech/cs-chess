<template>
  <div id="app">
    <Header />
    <GameControls />
    <HeadsUpDisplay />
    <ChessBoard />

    <!-- <Header />
    <b-container>
      <b-row>
        <b-col sm="6" offset="3">
          <QuestionBox v-if="questions.length" 
          :currentQuestion="questions[index]"
          :next="next" />
        </b-col>
      </b-row>
    </b-container>-->
  </div>
</template>

<script>
// import Header from "./components/Header.vue";
// import QuestionBox from "./components/QuestionBox.vue";

import Header from "./components/Header.vue";
import GameControls from "./components/GameControls.vue";
import HeadsUpDisplay from "./components/HeadsUpDisplay.vue";
import ChessBoard from "./components/ChessBoard.vue";

export default {
  name: "app",
  components: {
    Header,
    GameControls,
    HeadsUpDisplay,
    ChessBoard,
  }
  // components: {
  //   Header,
  //   QuestionBox
  // },
  // mounted: function() {
  //   fetch("https://opentdb.com/api.php?amount=10", {
  //     method: "get"
  //   })
  //     .then(response => response.json())
  //     .then(response => {
  //       this.questions = response.results;
  //       this.next();
  //     });
  // },
  // data() {
  //   return {
  //     questions: [],
  //     index: 0
  //   };
  // },
  // methods: {
  //   next() {
  //     this.index++;
  //     if (this.index > this.questions.length) {
  //       this.index = 0;
  //     }
  //   },
  //   previous() {
  //     this.index--;
  //     if (this.index < 0) {
  //       this.index = this.questions.length - 1;
  //     }
  //   }
  // }
};
</script>

<style lang="scss">
body {
  background-color:#212529;
}
</style>
