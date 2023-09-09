<template>
  <div>
    <input v-model="inputValue" @input="filterOptions" />
    <select v-if="filteredOptions.length > 0">
      <option v-for="option in filteredOptions" :value="option">{{ option }}</option>
    </select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputValue: '',
      options: ['mamhuevo 1', 'troleo 2', 'intento 3', 'argumento 4'],
    };
  },
  computed: {
    filteredOptions() {
      return this.options.filter(option => option.includes(this.inputValue));
    },
  },
  methods: {
    filterOptions() {
      // Implement any filtering logic here if needed
    },
  },
};
</script>
