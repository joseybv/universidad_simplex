<template>
  <v-container>
    <v-layout row wrap>
      <v-card dark raised>
        <v-card-title primary-title>Propiedades del Método</v-card-title>
        <v-card-text>
          <v-flex xs12>
            <v-text-field
              box
              name="Variables"
              label="Número de varibles"
              id="variables"
              v-model="vars"
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              box
              name="restricciones"
              label="Cantidad de restricciones"
              id="restricciones"
              v-model="restrictionCount"
            ></v-text-field>
          </v-flex>
          <v-card-title>Restricciones del método</v-card-title>
          <v-flex xs4 v-for="row in restrictions" v-bind:key="row">
            <v-text-field
              v-for="item in row"
              v-bind:key="item.id"
              box
              :name="item.name"
              :label="item.label"
              :model="item.value"
            ></v-text-field>
          </v-flex>
          <v-btn ripple round icon color="primary">
            <v-icon large color="white">add</v-icon>
          </v-btn>
        </v-card-text>
        <v-card-actions>
          <v-btn color="info">adelante</v-btn>
        </v-card-actions>
      </v-card>
    </v-layout>

    <v-chip close v-for="item in calculate" v-bind:key="item.slack.label">{{item.z}}</v-chip>
    <v-textarea label="label" name="name" v-model="tableau"></v-textarea>
    <v-btn color="success" @click="buildTableau">text</v-btn>
    <div v-html="tableText"></div>
  </v-container>
</template>

<script>
import Simplex from "./SimplexTableau";
import Tableau from "../components/Tableau";
export default {
  name: "simplex",
  components: {
    Tableau
  },
  data() {
    return {
      simplex: new Simplex(),
      vars: 0,
      x1: { value: 3, label: "X1" },
      x2: { value: 2, label: "X2" },
      constraints: [
        {
          type: "<=",
          result: 18,
          x1: {
            factor: 2
          },
          x2: {
            factor: 0
          }
        },
        {
          type: "<=",
          result: 32,
          x1: {
            factor: 2
          },
          x2: {
            factor: 3
          }
        },
        {
          type: "<=",
          result: 24,
          x1: {
            factor: 3
          },
          x2: {
            factor: 0
          }
        }
      ],
      restrictionCount: 0,
      normalizeRestrictions: [],
      tableau: []
    };
  },
  computed: {
    restrictions() {
      let restriction = [];
      for (let index = 1; index <= this.restrictionCount; index++) {
        let row = [];
        for (let element = 1; element <= this.vars; element++) {
          row.push({
            id: element,
            name: "X" + element,
            label: "X-" + element,
            value: 0
          });
        }
        restriction.push(row);
      }
      return restriction;
    },
    calculate() {
      this.normalizeRestrictions = this.simplex.normalizeRestrictions(
        "maximizar",
        this.constraints,
        this.x1,
        this.x2
      );
      return this.normalizeRestrictions;
    },
    tableText() {
      return this.simplex.printTable(this.tableau);
    }
  },
  methods: {
    buildTableau() {
      this.tableau = this.simplex.buildInitialBoard(this.normalizeRestrictions);
    }
  }
};
</script>

<style lang="scss" scoped></style>
