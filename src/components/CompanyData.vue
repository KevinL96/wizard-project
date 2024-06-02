<template>
  <div>
    <v-card
      class="py-8 px-6 text-center mx-auto ma-4"
      elevation="12"
      max-width="800"
      width="100%"
      color="white"
      v-if="showConfirmationMessage === false"
    >
      <v-card-title>
        <h3>Ingresa tu RUC</h3>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
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

                <v-row>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      v-model="correo"
                      label="Correo Electronico"
                      outlined
                      dense
                      required
                      type="email"
                      :rules="[
                        (v) => !!v || 'Correo Electronico es Necesario',
                        (v) =>
                          /.+@.+\..+/.test(v) || 'Correo Electronico invalido',
                      ]"
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
                  @click="sendData"
                ></v-btn>
              </v-card-text>
            </v-card>
          </v-expand-transition>
        </v-form>
      </v-card-text>
    </v-card>
    <v-expand-transition>
      <v-card
        v-if="showConfirmationMessage"
        class="py-8 px-6 text-center mx-auto ma-4"
        elevation="12"
        max-width="800"
        width="100%"
        color="green"
      >
        <v-card-title>
          <h3>Confirmacion</h3>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <h2>Tu Demo Ha sido Creado!</h2>
            </v-col>
          </v-row>
          <v-row center>
            <v-col>
              <v-icon class="zoom-in" center size="200"
                >mdi-check-circle</v-icon
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <!-- <p class="">Las Credenciales han sido enviadas al correo Electronico : <h2 class="zoom-in-out"><b>{{ correo }}</b></h2> </p> -->
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-expand-transition>
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
      valid: false,
      search: "",
      foundCompany: false,
      razonSocial: "",
      correo: "",

      nombreComercial: "",
      direccion: "",
      codigo: "",

      subsidiaries: [],
      selectedCode: null,

      showConfirmationMessage: false,
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
      const validationResult = await this.$refs.form.validate();

      if (validationResult.valid === true) {
        try {
          const response = await axios.get(`${API_URL}/ruc/${this.search}`);

          await this.$nextTick();

          if (response.data.status == true) {
            this.foundCompany = true;

            this.snackbar1 = true;
            this.snackbar1Message = "Datos de la Empresa Encontrados!";
            this.razonSocial = response.data.data.businessname;
            this.nombreComercial = response.data.data.commercialname;
            this.subsidiaries = response.data.data.subsidiaries;
          } else if (response.data.status == false) {
            this.foundCompany = false;
            this.snackbar2 = true;
            this.snackbar2Message = "Empresa no encontrada, Intente de nuevo";
          }
        } catch (error) {
          this.snackbar2 = true;
          this.snackbar2Message = "Error con la API " + error.message;
        }
      } else {
        this.snackbar2 = true;
        this.snackbar2Message = "Ingresa los datos correctamente";
      }
    },
    updateInputs() {
      const selectedSubsidiary = this.subsidiaries.find(
        (subsidiary) => subsidiary.code === this.selectedCode
      );
      if (selectedSubsidiary) {
        this.nombreComercial = selectedSubsidiary.commercial_name;
        this.direccion = selectedSubsidiary.address;
      }
    },
    async sendData() {
      const validationResult = await this.$refs.form.validate();

      if (validationResult.valid === true) {
        // Solo para Debugear el mensaje de confirmacion
        //Debe Eliminarse en Produccion todo el metodo setTimeOut
        setTimeout(() => {
          this.showConfirmationMessage = true;
          this.foundCompany = false;
        }, 2000);

        try {
          const response = await axios.post(
            `https://test.illarli.com/api/lead`,
            {
              name: this.name,
              lastname: this.lastname,
              phone: this.phone,
              ruc: this.search,
              address: this.direccion,
              commercial_name: this.nombreComercial,
              businessname: this.razonSocial,
              code: this.selectedCode,
              email: this.correo,
            }
          );

          if (response.data.status == true) {
            setTimeout(() => {
              this.showConfirmationMessage = true;
              this.foundCompany = false;
            }, 2000);
            this.snackbar3 = true;
            this.snackbar3Message = "Datos Enviados!";
          } else {
            this.snackbar2 = true;
            this.snackbar2Message = "Error al enviar los datos";
          }
        } catch (error) {
          this.snackbar2 = true;
          this.snackbar2Message = "Error al enviar los datos: " + error.message;
        }
      } else {
        this.snackbar2 = true;
        this.snackbar2Message = "Ingresa los datos correctamente";
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

<style scoped>
.spin {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
<style scoped>
.zoom-in {
  animation: zoom-in 0.5s forwards;
}

@keyframes zoom-in {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
<style scoped>
.zoom-in-out {
  animation: zoom-in-out 2s infinite;
}

@keyframes zoom-in-out {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}
</style>
