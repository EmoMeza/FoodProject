<template>
    <div>
    <div class="header">
      <div class="square" :class="{ active: $route.path === '/' }" @click="$router.push('/')">
        <h2>Menu</h2>
      </div>
      <div class="square" :class="{ active: $route.path === '/pedidos' }" @click="$router.push('/pedidos')">
        <h2>Pedidos</h2>
      </div>
      <div class="square" :class="{ active: $route.path === '/entrega' }" @click="$router.push('/entrega')">
        <h2>Entrega</h2>
      </div>
    </div>
    <div class="content">
      <nuxt />
    </div>
  </div>
  </template>
  <style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #f5f5f5;
  }
  
  .square {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100px;
    background-color: #ddd;
    cursor: pointer;
  }
  
  .square.active {
    background-color: #007bff;
    color: #fff;
  }
  
  .content {
    padding: 1rem;
  }
  </style>