<template>
  <v-container>
    <v-card dark raised>
      <v-card-title primary-title>Propiedades del Método</v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs4 offset-xs1>
            <v-text-field
              type="number"
              box
              name="x1"
              label="Valor de X1"
              id="varx1"
              v-model="x1.value"
            ></v-text-field>
          </v-flex>
          <v-flex xs4 offset-xs2>
            <v-text-field
              type="number"
              box
              name="x2"
              label="Valor de X2"
              id="varx2"
              v-model="x2.value"
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-layout row wrap>
              <v-flex xs8>
                <v-text-field
                  type="number"
                  box
                  name="restricciones"
                  label="Cantidad de restricciones"
                  id="restricciones"
                  v-model="restrictionCount"
                ></v-text-field>
              </v-flex>
              <v-flex xs4>
                <v-btn color="success" @click="buildRestrictions">generar</v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <v-card-title>Restricciones del método</v-card-title>
          </v-flex>
          <v-flex xs12 v-for="item in restrictions" v-bind:key="item.id">
            <v-layout row wrap>
              <v-flex xs3>
                <v-text-field
                  type="number"
                  box
                  :name="item.X1.name"
                  :label="item.X1.label"
                  v-model="item.X1.value"
                ></v-text-field>
              </v-flex>
              <v-flex xs1>
                <v-card flat>
                  <v-card-text>+</v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs3>
                <v-text-field
                  type="number"
                  box
                  :name="item.X2.name"
                  :label="item.X2.label"
                  v-model="item.X2.value"
                ></v-text-field>
              </v-flex>
              <v-flex xs1>
                <v-card flat>
                  <v-card-text>{{item.type}}</v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs3>
                <v-text-field
                  type="number"
                  box
                  :name="item.label"
                  :label="item.label"
                  v-model="item.value"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-btn color="info" @click="calculate">adelante</v-btn>
      </v-card-actions>
    </v-card>

    <v-chip close v-for="item in normalizeRestrictions" v-bind:key="item.slack.label">{{item.z}}</v-chip>
    <v-btn color="success" @click="buildTableau">Ver primera iteración</v-btn>
    <div v-html="tableText"></div>
  </v-container>
</template>

<script>
import Simplex from "./SimplexTableau";
export default {
  name: "simplex",
  components: {},
  data() {
    return {
      simplex: new Simplex(),
      simplexResponse: {},
      vars: 0,
      x1: { value: 3, label: "X1" },
      x2: { value: 2, label: "X2" },
      restrictionCount: 0,
      normalizeRestrictions: [],
      tableau: [],
      restrictions: []
    };
  },
  computed: {
    tableText() {
      return this.simplex.printTable(this.tableau, this.simplexResponse.pivot);
    }
  },
  methods: {
    calculate() {
      this.buildRestrictions();
      let constraints = this.buildConstraints();
      if (constraints.length === 0) return;
      this.normalizeRestrictions = this.simplex.normalizeRestrictions(
        "maximizar",
        constraints,
        this.x1,
        this.x2
      );
    },
    buildConstraints() {
      let constraints = [];
      if (this.restrictions.length == 0) this.buildRestrictions();
      if (this.restrictions.length == 0) return constraints;
      for (let restriction of this.restrictions) {
        constraints.push({
          type: restriction.type,
          result: restriction.value,
          x1: {
            factor: restriction.X1.value
          },
          x2: {
            factor: restriction.X2.value
          }
        });
      }
      return constraints;
    },
    buildRestrictions() {
      let restriction = [];
      if (this.restrictionCount == 0) return restriction;
      while (this.restrictions.length > this.restrictionCount) {
        this.restrictions.pop();
      }
      for (
        let index = this.restrictions.length;
        index <= this.restrictionCount - 1;
        index++
      ) {
        this.restrictions.push({
          id: index,
          X1: {
            name: "X1",
            label: "X-1",
            value: 0
          },
          X2: {
            name: "X2",
            label: "X-2",
            value: 0
          },
          type: "<=",
          label: "P" + index,
          value: 0
        });
      }
    },
    buildTableau() {
      this.calculate();
      if (this.normalizeRestrictions.length === 0) return;
      this.simplexResponse = this.simplex.buildInitialBoard(
        this.normalizeRestrictions
      );
      this.tableau = this.simplexResponse.display;
    }
  }
};
</script>

<style lang="scss" scoped></style>
