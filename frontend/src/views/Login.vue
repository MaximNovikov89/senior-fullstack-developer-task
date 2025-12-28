<template>
	<div class="login">
		<h2>Welcome to HyperGuest Test</h2>
		<div class="login-form">
			<input v-model="username" type="text" placeholder="Enter username" />
			<button @click="handleLogin" :disabled="!username">Login</button>
		</div>
		<p v-if="error" class="error">{{ error }}</p>
	</div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"

const router = useRouter()
const username = ref("")
const error = ref("")

// implementing "Use Vuex for all HTTP requests and state management."
// we will create a global store where we will keep our user data across the app
// no need to pass any data via props or re fetch.
// each components can acccess the data it needs from this point on.
//
// will move the login logic from the login.vue file to a separate file (this was we keep this file clean and maintanable code)
// in the global store we will have access to the users role, assuming he logged in successfully
// we will create a routing method in the store wher ewe can decide according to instruction whether a user with
// its roles have access to the asked paged
// NOTE: pages should not appear on the interface to user without the corresponding role
// but we should have a layer of prodection anyway.



const handleLogin = async () => {
	try {
		error.value = ""

		//once we implemented the global store correctly
		// we can now remove the logic from here entirely
		// only use the store functionallity we created
		// for example 
		// await userStore.login({userName:username.value})
		// if the login is ok we can redirect to home page since its accesible to all

		const response = await axios.post(`/api/users/login/${username.value}`)

		if (response.data) {
			router.push({
				path: "/home",
				query: { username: username.value },
			})
		}
	} catch (err) {
		error.value =
			err.response?.data?.message || "Login failed. Please try again."
	}
}
</script>

<style scoped>
.login {
	padding: 2rem;
	text-align: center;
	max-width: 400px;
	margin: 0 auto;
}

.login-form {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin-top: 2rem;
}

input {
	padding: 0.5rem;
	font-size: 1rem;
	border: 1px solid #ccc;
	border-radius: 4px;
}

button {
	padding: 0.5rem;
	font-size: 1rem;
	background-color: #42b983;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}

button:disabled {
	background-color: #ccc;
	cursor: not-allowed;
}

button:hover:not(:disabled) {
	background-color: #3aa876;
}

.error {
	color: #dc3545;
	margin-top: 1rem;
}
</style>
