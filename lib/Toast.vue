<script setup lang="ts">
import { VBtn, VCard, VCardActions, VCardText, VIcon, VSpacer, VAvatar, VImg, VProgressCircular, VExpandTransition } from 'vuetify/components'
import type { ToastProps } from './types'
import ProgressBar from './ProgressBar.vue';
import {ref, computed} from 'vue';

const isHovered = ref(false)

defineOptions({
  inheritAttrs: false,
})


const props = withDefaults(defineProps<ToastProps>(), {
  vertical: false,
  progressBar: true,
  progressDuration: 5000,
  cardActionsProps: () => ({}),
})

const reducePadding = computed(() => {
  return Boolean(props.avatar || props.multipleAvatars || props.action || props.description || props.appendAvatar)
})

defineEmits(['closeToast'])

</script>

<template>
  <VCard @mouseenter="isHovered = true" @mouseleave="isHovered = false" class="card-snackbar" v-bind="cardProps">
    <div :class="{ 'd-flex flex-no-wrap justify-space-between': !vertical }">
      <VCardText v-bind="cardTextProps" :class="{ 'd-flex align-center': prependIcon || reducePadding, 'pr-0': action, 'py-2': true}">
        <VAvatar v-if="avatar" class="mr-2" v-bind="avatarProps">
          <VImg :src="avatar" cover>
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <VProgressCircular
                  color="grey-lighten-2"
                  indeterminate
                ></VProgressCircular>
              </div>
            </template>
          </VImg>
        </VAvatar>
        <div v-else-if="multipleAvatars" class="d-flex align-center mr-8">
          <VAvatar v-for="img, i in multipleAvatars.length <= 5 ? multipleAvatars : multipleAvatars.slice(0, 5)" v-bind="avatarProps" :key="i" class="mr-n6" :style="{zIndex: 5-i}">
            <VImg :src="img" cover>
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <VProgressCircular
                    color="grey-lighten-2"
                    indeterminate
                  ></VProgressCircular>
                </div>
              </template>
            </VImg>
          </VAvatar>
        </div>
        <VIcon v-if="prependIcon" class="mr-2" :icon="prependIcon" v-bind="prependIconProps" />
        <div v-if="description">
          <div class="pb-0">
            <span v-html="text"></span>
          </div>
          <p class="font-weight-light" v-html="description" />
        </div>
        <template v-else>
          <div :class="{'py-2': !reducePadding}">
            <span v-html="text"></span>
          </div>
        </template>
        <VAvatar 
          @click="() => {
            $emit('closeToast')
            appendAvatarAction?.onClick?.()
          }" v-if="appendAvatar" class="mr-2" v-bind="appendAvatarProps">
          <VImg :src="appendAvatar" cover>
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <VProgressCircular
                  color="grey-lighten-2"
                  indeterminate
                ></VProgressCircular>
              </div>
            </template>
          </VImg>
        </VAvatar>
      </VCardText>
      
      <VCardActions v-if="action" v-bind="cardActionsProps">
        <VSpacer />
        <VBtn
          size="small"
          v-bind="action.buttonProps"
          :text="action.label"
          @click="() => {
            $emit('closeToast')
            action?.onClick?.()
          }"
        />
      </VCardActions>
    </div>
    <VExpandTransition>
      <ProgressBar v-show="progressBar" :duration="progressDuration" :progress-bar-props="progressBarProps" :is-paused="isHovered" :reverse-progress-bar="reverseProgressBar"></ProgressBar>
    </VExpandTransition>
  </VCard>
</template>

<style scoped lang="scss">
@use 'vuetify/settings';
.card-snackbar {
  background: settings.$snackbar-background;
  color: settings.$snackbar-color;
  max-width: 672px !important;
  min-width: 344px !important;
  min-height: 48px !important;
}
</style>
