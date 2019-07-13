<template>
  <div>
    <b-jumbotron>
      <p>{{ currentQuestion.question }}</p>
      <hr />
      <b-list-group>
        <b-list-group-item
          v-for="(answer, index) in answers"
          :key="index"
          @click="selectAnswer(index)" 
          :class="(selectedIndex === index) ? 'selected' : ''"
        >{{ answer }}</b-list-group-item>
      </b-list-group>
      <b-button variant="primary" href="#">Submit</b-button>
      <b-button @click="next" variant="success">Next</b-button>
    </b-jumbotron>
  </div>
</template>

<script>
export default {
  props: {
    currentQuestion: Object,
    next: Function
  },
  data() {
    return {
      selectedIndex: null,
    };
  },
  methods: {
    selectAnswer(index) {
      this.selectedIndex = index;
    },
  },
  watch: {
    currentQuestion() {
      this.selectedIndex = null;
    }
  },
  computed: {
    answers() {
      let answers = [...this.currentQuestion.incorrect_answers];
      answers.push(this.currentQuestion.correct_answer);
      return _.shuffle(answers);;
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.list-group {
  .list-group-item {
    margin-bottom: 15px;
    &:hover {
      background-color: #eee;
      cursor: pointer;
    }
    &.selected {
      background-color: lightblue;
    }
    &.correct {
      background-color: lightgreen;
    }
    &.incorrect {
      background-color: lightcoral;
    }
  }
}
</style>