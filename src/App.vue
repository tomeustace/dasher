<template>
  <md-theme id="app" name="'dasher'">
     <toolbar></toolbar>
     <container></container>
  </md-theme>
</template>

<script>
import Toolbar from './components/Toolbar';
import Container from './components/Container';
import ComponentShell from './components/ComponentShell';

export default {
  components: {
    Toolbar,
    Container,
    ComponentShell,
  },
};
</script>

<style>
html {
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

#app {
  height: 100%;
  width: 100%;
  text-align: center;
}

#app a {
  color: #42b983;
  text-decoration: none;
}

.item {
    min-width: 300px;
    min-height: 250px;
    margin: 10px;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 0;
    border: 1px green solid;
}    

.logo {
  width: 100px;
  height: 100px
}
</style>
