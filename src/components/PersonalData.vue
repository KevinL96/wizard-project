<template>
  <div>
    <v-card
      class="py-8 px-6 text-center mx-auto ma-4"
      elevation="12"
      max-width="800"
      width="100%"
      color="white"
    >
      <h3 class="text-h6 mb-4">Datos Personales</h3>
      <v-form ref="form" v-model="valid">
        <v-text-field
          v-model="name"
          label="Nombre"
          required
          :rules="[(v) => !!v || 'El nombre es requerido']"
        ></v-text-field>

        <v-text-field
          v-model="lastName"
          label="Apellido"
          required
          :rules="[(v) => !!v || 'El apellido es requerido']"
        ></v-text-field>

        <v-text-field
          v-model="phoneNumber"
          label="Número de teléfono"
          required
          :rules="[
            (v) => !!v || 'El número de teléfono es requerido',
            (v) =>
              (v && v.length === 10) ||
              'El número de teléfono debe tener 10 dígitos',
            (v) =>
              (v && v.startsWith('09')) ||
              'El número de teléfono debe comenzar con 09',
          ]"
          type="number"
        ></v-text-field>

        <v-btn
          class="my-4"
          color="purple"
          height="40"
          text="Enviar"
          variant="flat"
          width="70%"
          @click="validate"
        ></v-btn>

        <v-snackbar
          v-model="snackbar1"
          :timeout="2000"
          color="blue"
          elevation="24"
        >
          <v-icon left>mdi-information</v-icon>
          {{ snackbar1Message }}
        </v-snackbar>

        <v-snackbar
          v-model="snackbar2"
          :timeout="3000"
          color="red"
          elevation="24"
        >
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
      </v-form>
    </v-card>

    <v-expand-transition>
      <v-card
        v-if="otpSent"
        class="py-8 px-6 text-center mx-auto ma-4"
        elevation="12"
        max-width="800"
        width="100%"
        color="white"
      >
        <h3 class="text-h6 mb-4">Código OTP</h3>

        <v-sheet color="white">
          <v-otp-input
            color="white"
            v-model="otp"
            type="number"
            variant="solo"
            required
          ></v-otp-input>
        </v-sheet>

        <v-btn
          class="my-4"
          color="purple"
          height="40"
          text="Verificar"
          variant="flat"
          width="70%"
          @click="verifyOTP"
        ></v-btn>

        <div class="text-caption">
          No Recibiste el codigo ?
          <a href="#" @click.prevent="resendOTP">Reenviar</a>
        </div>
      </v-card>
    </v-expand-transition>
  </div>
</template>

<script>
import axios from "axios";
const API_URL = process.env.VUE_APP_API_URL;
console.log("API_URL:", API_URL);
export default {
  data: () => ({
    valid: false,
    name: "",
    lastName: "",
    phoneNumber: "",
    otp: "",
    otpSent: false,
    snackbar1: false,
    snackbar1Message: "",
    snackbar2: false,
    snackbar2Message: "",
    snackbar3: false,
    snackbar3Message: "",
  }),
  methods: {
    async validate() {
      const validationResult = await this.$refs.form.validate();
      console.log("Form validation result: ", validationResult.valid);

      if (validationResult.valid === true) {
        this.sendOTP();
      } else {
        this.snackbar2 = true;
        this.snackbar2Message = "Ingresa los datos correctamente";
      }
    },
    async sendOTP() {

      try {
        const response = await axios.get(`${API_URL}/send-code`);

        await this.$nextTick();

        console.log(response.data);

        if (response.data.status == true) {
          this.otpSent = true;

          this.snackbar1 = true;
          this.snackbar1Message = "OTP Enviado!";
        } else {
          this.otpSent = false;
          this.snackbar2 = true;
          this.snackbar2Message =
            "Error al Enviar OTP ,Espera unos Segundos .. ";
        }
      } catch (error) {
        this.snackbar2 = true;
        this.snackbar2Message = "Error sending OTP: " + error.message;
      }
    },

    async verifyOTP() {
      try {
        const response = await axios.post(`${API_URL}/verify-code`, {
          code: this.otp,
        });

        this.otpSent = true;

        if (response.data.status == true) {

          console.log("OTP verified successfully");
          try {
            const response = await axios.post(
              `${API_URL}/lead`,
              {
                name: this.name,
                lastname: this.lastName,
                phone: this.phoneNumber,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (response.data.status == true) {
              this.snackbar3 = true;
              this.snackbar3Message = "Codigo Verificado";
              setTimeout(() => {
                this.$router.push("/company");
              }, 2000);
            } else {
              this.snackbar2 = true;
              this.snackbar2Message = "Error al Enviar Datos";
            }
          } catch (error) {
            console.error("Error saving data:", error);
          }
        } else {
          this.snackbar2 = true;
          this.snackbar2Message = "Error al Verificar OTP";
        }
      } catch (error) {
        console.error("Error with  OTP verification:", error);
        this.snackbar2 = true;
        this.snackbar2Message = "Error al Verificar OTP";
      }
    },

    async resendOTP() {

      this.otpSent = false;
      this.sendOTP();
    },
  },
};
</script>
