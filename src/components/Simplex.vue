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
            <v-card-title>Restricciones del método</v-card-title>
          </v-flex>
          <v-flex xs12>
            <v-layout row wrap>
              <v-flex xs3>
                <v-text-field type="number" box name="R1X1" label="X-1" v-model="R1.X1Factor"></v-text-field>
              </v-flex>
              <v-flex xs1>
                <v-card flat>
                  <v-card-text>+</v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs3>
                <v-text-field type="number" box name="X2" label="X-2" v-model="R1.X2Factor"></v-text-field>
              </v-flex>
              <v-flex xs1>
                <v-card flat>
                  <v-card-text>{{R1Type}}</v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs3>
                <v-text-field type="number" box name="P0" label="P0" v-model="R1.Value"></v-text-field>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <v-layout row wrap>
              <v-flex xs3>
                <v-text-field type="number" box name="X1" label="X-1" v-model="R2X1Factor"></v-text-field>
              </v-flex>
              <v-flex xs1>
                <v-card flat>
                  <v-card-text>+</v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs3>
                <v-text-field type="number" box name="X2" label="X-2" :model="R2X2Factor"></v-text-field>
              </v-flex>
              <v-flex xs1>
                <v-card flat>
                  <v-card-text>{{R2Type}}</v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs3>
                <v-text-field type="number" box name="R2P0" label="P-0" :model="R2Value"></v-text-field>
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
      R1: {
        X1Factor: 0,
        X2Factor: 0,
        Value: 0,
        Type: "<="
      },
      R1X1Factor: 0,
      R1X2Factor: 0,
      R1Value: 0,
      R1Type: 0,
      R2X1Factor: 0,
      R2X2Factor: 0,
      R2Value: 0,
      R2Type: 0
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
      let restrictions = [{}, {}];
      for (let restriction of restrictions) {
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
