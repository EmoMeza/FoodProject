<template>
    <div v-if="show" :class="['alert', 'alert-' + type]" role="alert">
        {{ message }}
    </div>
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            required: true
        },
        type: {
            type: String,
            default: 'info',
            validator: function (value) {
                return ['info', 'success', 'warning', 'danger'].indexOf(value) !== -1
            }
        },
        message: {
            type: String,
            required: true
        }
    }
}
</script>

<style>
.alert {
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid transparent;
    border-radius: 0.25rem;
}

.alert-info {
    color: #f9f9f9;
    background-color: #000000;
    border-color: #df0c0c;
}

.alert-success {
    color: #155724;
    background-color: #d4edda;
    border-color: #c3e6cb;
}

.alert-warning {
    color: #856404;
    background-color: #090908;
    border-color: #070707;
}

.alert-danger {
    color: #721c24;
    background-color: #020202;
    border-color: #000000;
}
</style>