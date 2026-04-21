<template>
  <span>
    <v-btn
      color="teal lighten-2"
      dark
      fab
      elevation="2"
      x-small
      @click="openFilePicker"
    >
      <v-icon dark>mdi-plus</v-icon>
    </v-btn>

    <input
      ref="fileInput"
      type="file"
      accept=".log,.txt"
      multiple
      style="display: none"
      @change="onFileInputChange"
    />

    <v-dialog v-model="dialog" max-width="480px">
      <v-card>
        <v-card-title>Add trace files</v-card-title>
        <v-card-text>
          <div
            class="drop-zone"
            :class="{ 'drop-zone--active': dragging }"
            @dragover.prevent="dragging = true"
            @dragleave.prevent="dragging = false"
            @drop.prevent="onDrop"
            @click="openFilePicker"
          >
            <v-icon large color="teal lighten-2">mdi-file-upload-outline</v-icon>
            <div class="mt-2">Drop <code>.log</code> files here or click to browse</div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="red lighten-3" @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script lang="ts">
import { dispatchCreateTrace } from '@/store/data/actions';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class AddTraceButton extends Vue {
  public dialog = false;
  public dragging = false;

  public openFilePicker() {
    this.dialog = true;
    this.$nextTick(() => {
      (this.$refs.fileInput as HTMLInputElement).click();
    });
  }

  public async onDrop(event: DragEvent) {
    this.dragging = false;
    const files = Array.from(event.dataTransfer?.files ?? []);
    await this.loadFiles(files);
  }

  public async onFileInputChange(event: Event) {
    const files = Array.from((event.target as HTMLInputElement).files ?? []);
    await this.loadFiles(files);
    (this.$refs.fileInput as HTMLInputElement).value = '';
  }

  private async loadFiles(files: File[]) {
    this.dialog = false;
    for (const file of files) {
      await dispatchCreateTrace(this.$store, file);
    }
  }
}
</script>

<style scoped>
.drop-zone {
  border: 2px dashed #80cbc4;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s;
}
.drop-zone--active {
  background: rgba(128, 203, 196, 0.15);
}
</style>
