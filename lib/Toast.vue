<script setup lang="ts">
import { VAvatar, VBtn, VCard, VCardActions, VCardText, VExpandTransition, VIcon, VImg, VProgressCircular, VSpacer } from 'vuetify/components'
import { computed, ref } from 'vue'
import type { ToastProps } from './types'
import ProgressBar from './ProgressBar.vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ToastProps>(), {
  vertical: false,
  progressBar: true,
  progressDuration: 5000,
  reverseProgressBar: false,
  cardActionsProps: () => ({}),
})

defineEmits(['closeToast'])

const isHovered = ref(false)

const reducePadding = computed(() => {
  return Boolean(props.avatar || props.multipleAvatars || props.action || props.description || props.appendAvatar)
})
</script>

<template>
  <VCard class="card-snackbar" v-bind="cardProps" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <div :class="{ 'd-flex flex-no-wrap justify-space-between': !vertical }">
      <VCardText v-bind="cardTextProps" class="py-2" :class="{ 'd-flex align-center': prependIcon || reducePadding, 'pr-0': action }">
        <VAvatar v-if="avatar" class="mr-2" v-bind="avatarProps">
          <VImg :src="avatar" cover>
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <VProgressCircular
                  color="grey-lighten-2"
                  indeterminate
                />
              </div>
            </template>
          </VImg>
        </VAvatar>
        <div v-else-if="multipleAvatars" class="d-flex align-center mr-8">
          <VAvatar v-for="img, i in multipleAvatars.length <= 5 ? multipleAvatars : multipleAvatars.slice(0, 5)" v-bind="avatarProps" :key="i" class="mr-n6" :style="{ zIndex: 5 - i }">
            <VImg :src="img" cover>
              <template #placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <VProgressCircular
                    color="grey-lighten-2"
                    indeterminate
                  />
                </div>
              </template>
            </VImg>
          </VAvatar>
        </div>
        <VIcon v-if="prependIcon" class="mr-2" :icon="prependIcon" v-bind="prependIconProps" />
        <div v-if="description">
          <div class="pb-0">
            <span v-html="text" />
          </div>
          <p class="font-weight-light" v-html="description" />
        </div>
        <template v-else>
          <div :class="{ 'py-2': !reducePadding }">
            <span v-html="text" />
          </div>
        </template>
        <VAvatar
          v-if="appendAvatar" class="mr-2" v-bind="appendAvatarProps" @click="() => {
            $emit('closeToast')
            appendAvatarAction?.onClick?.()
          }"
        >
          <VImg :src="appendAvatar" cover>
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <VProgressCircular
                  color="grey-lighten-2"
                  indeterminate
                />
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
      <ProgressBar v-show="progressBar" :duration="progressDuration" :progress-bar-props="progressBarProps" :is-paused="isHovered" :reverse-progress-bar="reverseProgressBar" />
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
