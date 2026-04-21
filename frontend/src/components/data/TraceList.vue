<template>
    <v-list
      class="col mb-0 py-0 my-0 rounded-b-lg no-scrollbar"
      style="overflow-x: hidden;"
    >
        <v-list-group
          v-for="trace in traces"
          :key="trace.id"
          @click="setAcitveTrace(trace)"
          color="primary"
          v-bind:disabled="isLoading"
        >
          <template v-slot:activator>
            <v-list-item-content class="mb-0 px-0">
              <v-list-item-title class="text-h6 font-weight-regular">
                {{fileName(trace.path)}}
              </v-list-item-title>
              <v-list-item-subtitle style="word-break: break-all;" class="wrap-text text-caption overflow-x-scroll">
                {{trace.path}}
              </v-list-item-subtitle>
              <v-list-item-content class="pb-0">
                <div class="d-flex align-center" v-if="Object.keys(trace.parameters).length > 0">
                <v-chip-group
                  column
                >
                  <v-tooltip
                    color="black"
                    bottom
                  >
                    <template #activator="{ on }">
                      <v-chip
                        color="cyan"
                        text-color="white"
                        v-on="on"
                        small
                      > {{trace.parameters.state[trace.parameters.state.length - 1].state}} </v-chip>
                    </template>
                    <span>Length</span>
                    </v-tooltip>
                    <v-tooltip
                      color="black"
                      bottom
                    >
                      <template #activator="{ on }">
                        <v-chip
                          color="green"
                          text-color="white"
                          v-on="on"
                          small
                        > {{trace.parameters.state.length}} </v-chip>
                      </template>
                      <span>Samples</span>
                    </v-tooltip>
                    <v-tooltip
                      color="black"
                      bottom
                      v-if="trace.activeParams.length"
                    >
                      <template #activator="{ on }">
                        <v-chip
                          color="red"
                          text-color="white"
                          v-on="on"
                          @click:close="setActiveParams(trace)"
                          small
                          close
                        > {{trace.activeParams.length}}</v-chip>
                      </template>
                      <span>Active</span>
                    </v-tooltip>
                  </v-chip-group>
                  <v-progress-circular
                      indeterminate
                      color="primary"
                      size="20"
                      class="pl-1"
                      v-if="trace.isLoading"
                  ></v-progress-circular>
                  </div>
              </v-list-item-content>
            </v-list-item-content>

          </template>
          <div style="overflow-x: hidden !important; overflow-y: auto !important;" v-if="openTraceID === trace.id && activeTraceIDs.includes(trace.id)">
            <div class="my-3 mx-2">
              <div class="d-flex align-center">
                <div>Burn-in</div>
                <v-slider
                  v-on:change="setBurnIn($event, trace.id)"
                  v-model="burnIn[trace.id]"
                  :max="99"
                  :min="0"

                  hide-details
                ></v-slider>
                <span class="fixed-width">{{burnIn[trace.id]}}</span>%
              </div>
            </div>
            <v-divider class="my-0"></v-divider>
            <div style="overflow-x:hidden" >
              <div>
              </div>
              <ParamsPanel :trace="trace" height="400px" />
            </div>
            
          </div>
          <div v-show="!('state' in trace.parameters)" class="text-center my-4">
             <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
          <v-divider></v-divider>
          </v-list-group>
          </v-list>
          
</template>

<style>
.no-scrollbar {
  overflow-y: scroll; /* Add the ability to scroll */
}
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.fixed-width {
    display: inline-block;
    width: 1.2em;  /* Adjust this width to fit your content */
    text-align: right;
}

</style>

<script lang="ts">
import AddTraceButton from '@/components/data/AddTraceButton.vue';
import ParamsPanel from '@/components/data/ParamsPanel.vue';
import {
  dispatchSetActiveParams,
  dispatchSetActiveTrace,
  dispatchSetBurnIn,
} from '@/store/data/actions';
import { readActiveTraceIDs, readLoadingSamples, readTraces } from '@/store/data/getters';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    AddTraceButton,
    ParamsPanel,
  },
})
export default class TraceList extends Vue {
  public activeTraces = [];
  public openTraceID = null;
  public show: boolean = true;
  // this is so dumb need a better way to do dynamic v-model defualts
  public burnIn = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];

  get traces() {
    const traces = readTraces(this.$store);
    return traces;
  }

  get activeTraceIDs() {
    return readActiveTraceIDs(this.$store);
  }

  get isLoading() {
    return readLoadingSamples(this.$store);
  }

  public setActiveParams(trace) {
      dispatchSetActiveParams(this.$store, {traceID: trace.id, params: []});
  }

  public setBurnIn(value, traceID) {
    dispatchSetBurnIn(this.$store, {traceID, burnIn: value});
  }

  public async setAcitveTrace(trace) {
    this.openTraceID = trace.id;
    await dispatchSetActiveTrace(this.$store, trace);
  }

  public fileName(path) {
    return path.substring(path.lastIndexOf('/') + 1);
  }
}
</script>