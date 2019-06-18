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
                <v-btn color="success">generar</v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <v-card-title>Restricciones del método</v-card-title>
          </v-flex>
          <v-flex xs12>
            <v-layout row wrap>
              <v-flex xs3>
                <v-text-field
                  type="number"
                  box
                  :name="restriction1.X1.name"
                  :label="restriction1.X1.label"
                  :model="restriction1.X1.factor"
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
                  :name="restriction1.X2.name"
                  :label="restriction1.X2.label"
                  :model="restriction1.X2.factor"
                ></v-text-field>
              </v-flex>
              <v-flex xs1>
                <v-card flat>
                  <v-card-text>{{restriction1.type}}</v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs3>
                <v-text-field
                  type="number"
                  box
                  :name="restriction1.label"
                  :label="restriction1.label"
                  :model="restriction1.result"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <v-layout row wrap>
              <v-flex xs3>
                <v-text-field
                  type="number"
                  box
                  :name="restriction2.X1.name"
                  :label="restriction2.X1.label"
                  :model="restriction2.X1.factor"
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
                  :name="restriction2.X2.name"
                  :label="restriction2.X2.label"
                  :model="restriction2.X2.factor"
                ></v-text-field>
              </v-flex>
              <v-flex xs1>
                <v-card flat>
                  <v-card-text>{{restriction2.type}}</v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs3>
                <v-text-field
                  type="number"
                  box
                  :name="restriction2.label"
                  :label="restriction2.label"
                  :model="restriction2.result"
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
      restrictionCount: 0,
      normalizeRestrictions: [],
      tableau: [],
      restriction1: {
        id: 0,
        type: "<=",
        result: 0,
        label: "P0",
        X1: {
          label: "X-1",
          name: "X1",
          factor: 0
        },
        X2: {
          label: "X-2",
          name: "X2",
          factor: 0
        }
      },
      restriction2: {
        id: 1,
        type: "<=",
        result: 0,
        label: "P1",
        X1: {
          label: "X-1",
          name: "X1",
          factor: 0
        },
        X2: {
          label: "X-2",
          name: "X2",
          factor: 0
        }
      }
    };
  },
  computed: {
    tableText() {
      return this.simplex.printTable(this.tableau);
    }
  },
  methods: {
    calculate() {
      this.normalizeRestrictions = this.simplex.normalizeRestrictions(
        "maximizar",
        this.buildConstraints(),
        this.x1,
        this.x2
      );
    },
    buildConstraints() {
      let constraints = [];
      for (let restriction of [this.restriction1, this.restriction2]) {
        constraints.push({
          type: restriction.type,
          result: restriction.result,
          x1: restriction.X1,
          x2: restriction.X2
        });
      }
      return constraints;
    },
    buildTableau() {
      this.tableau = this.simplex.buildInitialBoard(this.normalizeRestrictions);
    }
  }
};
</script>

<style lang="scss" scoped></style>
