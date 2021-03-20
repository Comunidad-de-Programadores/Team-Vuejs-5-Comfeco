<template>
  <section
    class="w-11/12 md:w-8/12 lg:w-11/12 m-auto flex-grow py-16 grid grid-cols-1 lg:grid-cols-5 lg:gap-4 lg:gap-x-12"
  >
    <div class="p-4 col-span-1">
      <section class="space-y-4">
        <div class="flex justify-between">
          <h3 class="text-xl font-semibold">{{ getGroupName }}</h3>
          <div class="text-right">
            <a href="#" class="text-sm text-blue-500 font-semibold">
              Ir al grupo
            </a>
          </div>
        </div>
      </section>

      <div
        class="flex py-3 mt-4 space-x-2 border-b border-purple-500"
        v-for="index in [1, 2, 3, 4, 5]"
        :key="index"
      >
        <figure class="w-12 h-12 rounded-full overflow-hidden">
          <img src="../../../assets/images/avatar.jpg" alt="avatar" />
        </figure>
        <div class="flex-grow">
          <h4 class="text-lg font-semibold leading-none">
            Usuario
          </h4>
          <div class="text-right">
            <a href="#" class="text-sm text-blue-500 font-semibold">
              Integrante
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="col-span-4">
      <div class="flex flex-wrap -mx-2 space-y-4 md:space-y-0">
        <div class="w-full px-2 md:w-1/2">
          <select
            class="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
            v-model="filterByLanguage"
          >
            <option value="">Filtrar por lenguaje</option>
            <option>C++</option>
            <option>Haskell</option>
            <option>Typescript</option>
            <option>PHP</option>
            <option>Python</option>
            <option>Java</option>
            <option>Javascript</option>
            <option>C#</option>
          </select>
        </div>
        <div class="w-full px-2 md:w-1/2">
          <input
            class="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
            placeholder="Buscar"
            type="text"
            v-model="searchByName"
            v-on:keyup.enter="$event.target.blur()"
          />
        </div>
      </div>

      <div class="container mx-auto">
        <div class="flex flex-wrap -mx-4">
          <div
            class="w-full sm:w-1/2 md:w-1/2 xl:w-1/4 p-4"
            v-for="(group, index) in getGroupsFilter"
            :key="index"
          >
            <div
              class="c-card block bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden"
            >
              <div class="relative pb-48 overflow-hidden">
                <img
                  class="absolute inset-0 h-full w-full object-cover"
                  src="../../../assets/images/card_group.jpg"
                  alt=""
                />
              </div>
              <div class="p-4">
                <span
                  class="inline-block px-2 py-1 leading-none bg-orange-200 text-orange-800 rounded-full font-semibold uppercase tracking-wide text-xs"
                  >{{ group.language }}</span
                >
                <h2 class="mt-2 mb-2  font-bold">{{ group.name }}</h2>
                <p class="text-sm">{{ group.description }}</p>
                <div class="mt-3 flex items-center justify-center">
                  <button
                    class="h-10 px-5 m-2 text-blue-100 transition-colors duration-150 bg-blue-600 rounded-lg focus:shadow-outline hover:bg-blue-700"
                    @click="joinGroup(group.name)"
                  >
                    Unirse
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { auth, db } from '../../../config/firebase';

export default {
  name: 'Badge',

  data() {
    return {
      groups: [],
      filterByLanguage: '',
      searchByName: '',
      user: {
        group: '',
      },
    };
  },

  mounted() {
    this.getGroups();
    this.getUser();
  },

  computed: {
    getGroupsFilter() {
      return this.getGroupsFilterByName.filter((x) =>
        this.getGroupsFilterByLanguage.includes(x)
      );
    },

    getGroupsFilterByLanguage() {
      if (this.filterByLanguage === '') return this.groups;

      return this.groups.filter((val) => {
        return (
          val.language.toLowerCase() === this.filterByLanguage.toLowerCase()
        );
      });
    },

    getGroupsFilterByName() {
      if (this.searchByName === '') return this.groups;

      return this.groups.filter((val) => {
        return val.name.toLowerCase().includes(this.searchByName.toLowerCase());
      });
    },

    getGroupName() {
      if (this.user.group === undefined) return 'Mi Grupo';

      return this.user.group;
    },
  },

  methods: {
    getGroups: async function() {
      const groups = await db.collection('groups').get();

      groups.forEach((doc) => {
        let data = doc.data();
        let new_group = {
          name: doc.id,
          description: data.description,
          language: data.language,
        };
        this.groups.push(new_group);
      });
    },

    getUser: async function() {
      const authUser = auth.currentUser;

      let document = await db
        .collection('users')
        .doc(authUser.uid)
        .get();
      let user = document.data();

      this.user.group = user.group;
    },

    joinGroup: async function(name) {
      const authUser = auth.currentUser;

      await db
        .collection('users')
        .doc(authUser.uid)
        .update({
          group: name,
        });

      this.user.group = name;
    },
  },
};
</script>

<style></style>
