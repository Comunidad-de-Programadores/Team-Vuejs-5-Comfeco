<template>
  <section
    class="w-11/12 md:10/12 m-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pt-16"
  >
    <div
      class="max-w-xs m-auto overflow-hidden rounded-lg shadow-lg"
      v-for="(event, index) in events"
      :key="index"
    >
      <img
        class="object-cover w-full h-48"
        src="../../../assets/images/time.jpg"
        alt="Flower and sky"
      />
      <div class="px-6 py-4">
        <h4 class="mb-3 text-xl font-semibold tracking-tight text-gray-800">
          {{ event.name }}
        </h4>
        <p class="leading-normal text-gray-700">{{ event.description }}</p>
      </div>

      <button
        class="px-6 m-2 text-green-100 transition-colors duration-150 bg-green-700 rounded-lg focus:shadow-outline hover:bg-green-800 py-2"
        @click="joinEvent(event.name)"
        :disabled="user.event !== ''"
        v-if="event.name !== user.event"
      >
        Participar
      </button>

      <section v-else>
        <div
          class="px-4 py-3 leading-normal text-blue-700 bg-blue-100 rounded-lg"
        >
          <p>Ya estas participando</p>
        </div>

        <button
          class="h-10 px-5 m-2 text-green-100 transition-colors duration-150 bg-green-700 rounded-lg focus:shadow-outline hover:bg-green-800"
          @click="leaveEvent()"
        >
          Abandonar
        </button>
      </section>
    </div>
  </section>
</template>

<script>
import { auth, db } from '../../../config/firebase';
export default {
  data() {
    return {
      events: [],
      user: {
        event: '',
      },
    };
  },

  mounted() {
    this.getEvents();
    this.getUser();
  },

  methods: {
    getUser: async function() {
      const authUser = auth.currentUser;

      let document = await db
        .collection('users')
        .doc(authUser.uid)
        .get();
      let user = document.data();

      this.user.event = user.event;
    },

    getEvents: async function() {
      const events = await db.collection('events').get();

      events.forEach((doc) => {
        let data = doc.data();
        let new_event = { name: doc.id, description: data.description };
        this.events.push(new_event);
      });
    },

    joinEvent: async function(name) {
      const authUser = auth.currentUser;

      await db
        .collection('users')
        .doc(authUser.uid)
        .update({
          event: name,
        });

      this.user.event = name;
    },

    leaveEvent: async function() {
      const authUser = auth.currentUser;

      await db
        .collection('users')
        .doc(authUser.uid)
        .update({
          event: '',
        });

      this.user.event = '';
    },
  },
};
</script>
