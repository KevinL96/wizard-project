<template>
  <div>
    <v-card
      class="py-8 px-6 text-center mx-auto ma-4"
      elevation="12"
      max-width="800"
      width="100%"
      color="white"
    >
      <v-card-title>
        <h3>Ingresa tu RUC</h3>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row>
            <v-col cols="12" sm="11">
              <v-text-field
                v-model="search"
                label="Ingresa tu numero de RUC"
                outlined
                dense
                apend-icon="mdi-magnify"
                clearable
                required
                :rules="[
                  (v) => !!v || 'RUC es Necesario',
                  (v) =>
                    (v && v.length === 13) || 'El RUC debe tener 13 dígitos',
                ]"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="1">
              <v-btn @click="fetchCompanyData" color="purple">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <v-expand-transition>
            <v-card
              v-if="foundCompany"
              class="py-8 px-6 text-center mx-auto ma-4"
              elevation="12"
              max-width="800"
              width="100%"
              color="white"
            >
              <v-card-title>
                <h3>Datos de la Empresa</h3>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      v-model="razonSocial"
                      label="Razon social"
                      outlined
                      dense
                      required
                      type="text"
                      :rules="[(v) => !!v || 'Razon social es Necesaria']"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="13" sm="4">
                    <v-select
                      v-model="selectedCode"
                      :items="subsidiaryCodes"
                      item-text="code"
                      item-value="code"
                      label="Selecciona un codigo"
                      outlined
                      dense
                      required
                      color="purple"
                      @change="updateInputs"
                    ></v-select>
                  </v-col>
                  <v-col cols="13" sm="8">
                    <v-text-field
                      v-model="direccion"
                      label="Direccion"
                      outlined
                      dense
                      required
                      type="text"
                      :rules="[(v) => !!v || 'Direccion es Necesaria']"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      v-model="nombreComercial"
                      label="Nombre Comercial"
                      outlined
                      dense
                      required
                      type="text"
                      :rules="[(v) => !!v || 'Nombre Comercial es Necesario']"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-btn
                  class="my-4"
                  color="purple"
                  height="40"
                  text="Enviar"
                  variant="flat"
                  width="70%"
                  @click=""
                ></v-btn>
              </v-card-text>
            </v-card>
          </v-expand-transition>
        </v-form>
      </v-card-text>
    </v-card>
    <v-snackbar v-model="snackbar1" :timeout="2000" color="blue" elevation="24">
      <v-icon left>mdi-information</v-icon>
      {{ snackbar1Message }}
    </v-snackbar>
    <v-snackbar v-model="snackbar2" :timeout="3000" color="red" elevation="24">
      <v-icon left>mdi-alert-circle</v-icon>
      {{ snackbar2Message }}
    </v-snackbar>
    <v-snackbar
      v-model="snackbar3"
      :timeout="3000"
      color="green"
      elevation="24"
    >
      <v-icon left>mdi-check-circle</v-icon>
      {{ snackbar3Message }}
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";

const API_URL = process.env.VUE_APP_API_URL;
export default {
  data() {
    return {
      search: "",
      foundCompany: false,
      razonSocial: "",

      nombreComercial: "",
      direccion: "",
      codigo: "",

      subsidiaries: [],
      selectedCode: null,

      snackbar1: false,
      snackbar1Message: "Information",
      snackbar2: false,
      snackbar2Message: "Alert",
      snackbar3: false,
      snackbar3Message: "Check",
    };
  },
  computed: {
    subsidiaryCodes() {
      return this.subsidiaries.map((subsidiary) => subsidiary.code);
    },
  },
  methods: {
    async fetchCompanyData() {
      // Perform API call to fetch company data based on RUC
      // Once you have the data, update the form fields accordingly
      // For example:
      try {
        const response = await axios.get(`${API_URL}/ruc/${this.search}`);

        await this.$nextTick();

        console.log(response.data);

        if (response.data.status == true) {
          this.foundCompany = true;

          // If the OTP is sent, do something
          this.snackbar3 = true;
          this.snackbar3Message = "Datos de la Empresa Encontrados!";
          this.razonSocial = response.data.data.businessname;
          this.nombreComercial = response.data.data.commercialname;
          this.subsidiaries = response.data.data.subsidiaries;
          console.log("Subsidiaries: ", this.subsidiaries);

          console.log("Razon Social: ", this.razonSocial);
        } else if (response.data.status == false) {
          this.foundCompany = false;
          this.snackbar2 = true;
          this.snackbar2Message = "Empresa no encontrada, Intente de nuevo";
          console.log("Empresa no encontrada");
        }
      } catch (error) {
        this.snackbar2 = true;
        this.snackbar2Message = "Error  " + error.message;
      }
    },
    updateInputs() {
      console.log("Selected code:", this.selectedCode);
      console.log("Subsidiaries:", this.subsidiaries);
      const selectedSubsidiary = this.subsidiaries.find(
        (subsidiary) => subsidiary.code === this.selectedCode
      );
      if (selectedSubsidiary) {
        this.nombreComercial = selectedSubsidiary.commercial_name;
        this.direccion = selectedSubsidiary.address;
        // Update other inputs as needed...
      }
    },
  },
  watch: {
    selectedCode() {
      this.updateInputs();
    },
  },
};
</script>
<style scoped>
:deep(.v-text-field input[type="number"])::-webkit-inner-spin-button,
:deep(.v-text-field input[type="number"])::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

:deep(.v-text-field input[type="number"]) {
  -moz-appearance: textfield;
}
</style>
