<template>
  <section>
    <div>
      <input type="text" v-model="userInput" placeholder="Enter your text here" />
      <button @click="displayUserInput">Display</button>
    </div>
    <div v-if="displayedInput">Name: {{ displayedInput }}</div>
    <div v-if="displayedResponse">Age: <div>{{ displayedResponse }}</div></div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      userInput: '',
      displayedInput: '',
      displayedResponse: ''
    }
  },
  methods: {
    displayUserInput() {
      this.displayedInput = this.userInput;
      // Make API call to backend
      fetch(`http://localhost:4040/age?nombre=${this.userInput}`)
      .then(response => response.json())
      .then(data => {
        this.displayedResponse = data;
      })
      .catch(error => console.error(error));
      this.displayUserInput = '';
    }
  }
}
</script>
