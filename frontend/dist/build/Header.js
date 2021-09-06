
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, a as append_styles, m as create_slot, b as validate_slots, e as element, g as attr_dev, h as add_location, j as insert_dev, q as update_slot_base, r as get_all_dirty_from_scope, w as get_slot_changes, y as transition_in, z as transition_out, l as detach_dev, F as svg_element, k as append_dev, t as text, G as set_data_dev, f as space, o as toggle_class, p as action_destroyer, x as is_function, H as assign, I as compute_rest_props, J as exclude_internal_props, K as set_attributes, L as listen_dev, M as get_spread_update, N as run_all, O as bubble, P as binding_callbacks, Q as group_outros, R as check_outros, v as validate_store, T as currentCountry, c as component_subscribe, U as goto, A as create_component, B as mount_component, C as destroy_component, V as select_value, W as validate_each_argument, n as noop, D as set_style, X as add_render_callback, Y as select_option, Z as destroy_each } from './main.js';

/* eslint-disable no-param-reassign */

/**
 * Options for customizing ripples
 */
const defaults = {
  color: 'currentColor',
  class: '',
  opacity: 0.1,
  centered: false,
  spreadingDuration: '.4s',
  spreadingDelay: '0s',
  spreadingTimingFunction: 'linear',
  clearingDuration: '1s',
  clearingDelay: '0s',
  clearingTimingFunction: 'ease-in-out',
};

/**
 * Creates a ripple element but does not destroy it (use RippleStop for that)
 *
 * @param {Event} e
 * @param {*} options
 * @returns Ripple element
 */
function RippleStart(e, options = {}) {
  e.stopImmediatePropagation();
  const opts = { ...defaults, ...options };

  const isTouchEvent = e.touches ? !!e.touches[0] : false;
  // Parent element
  const target = isTouchEvent ? e.touches[0].currentTarget : e.currentTarget;

  // Create ripple
  const ripple = document.createElement('div');
  const rippleStyle = ripple.style;

  // Adding default stuff
  ripple.className = `material-ripple ${opts.class}`;
  rippleStyle.position = 'absolute';
  rippleStyle.color = 'inherit';
  rippleStyle.borderRadius = '50%';
  rippleStyle.pointerEvents = 'none';
  rippleStyle.width = '100px';
  rippleStyle.height = '100px';
  rippleStyle.marginTop = '-50px';
  rippleStyle.marginLeft = '-50px';
  target.appendChild(ripple);
  rippleStyle.opacity = opts.opacity;
  rippleStyle.transition = `transform ${opts.spreadingDuration} ${opts.spreadingTimingFunction} ${opts.spreadingDelay},opacity ${opts.clearingDuration} ${opts.clearingTimingFunction} ${opts.clearingDelay}`;
  rippleStyle.transform = 'scale(0) translate(0,0)';
  rippleStyle.background = opts.color;

  // Positioning ripple
  const targetRect = target.getBoundingClientRect();
  if (opts.centered) {
    rippleStyle.top = `${targetRect.height / 2}px`;
    rippleStyle.left = `${targetRect.width / 2}px`;
  } else {
    const distY = isTouchEvent ? e.touches[0].clientY : e.clientY;
    const distX = isTouchEvent ? e.touches[0].clientX : e.clientX;
    rippleStyle.top = `${distY - targetRect.top}px`;
    rippleStyle.left = `${distX - targetRect.left}px`;
  }

  // Enlarge ripple
  rippleStyle.transform = `scale(${
    Math.max(targetRect.width, targetRect.height) * 0.02
  }) translate(0,0)`;
  return ripple;
}

/**
 * Destroys the ripple, slowly fading it out.
 *
 * @param {Element} ripple
 */
function RippleStop(ripple) {
  if (ripple) {
    ripple.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'opacity') ripple.remove();
    });
    ripple.style.opacity = 0;
  }
}

/**
 * @param node {Element}
 */
var Ripple = (node, _options = {}) => {
  let options = _options;
  let destroyed = false;
  let ripple;
  let keyboardActive = false;
  const handleStart = (e) => {
    ripple = RippleStart(e, options);
  };
  const handleStop = () => RippleStop(ripple);
  const handleKeyboardStart = (e) => {
    if (!keyboardActive && (e.keyCode === 13 || e.keyCode === 32)) {
      ripple = RippleStart(e, { ...options, centered: true });
      keyboardActive = true;
    }
  };
  const handleKeyboardStop = () => {
    keyboardActive = false;
    handleStop();
  };

  function setup() {
    node.classList.add('s-ripple-container');
    node.addEventListener('pointerdown', handleStart);
    node.addEventListener('pointerup', handleStop);
    node.addEventListener('pointerleave', handleStop);
    node.addEventListener('keydown', handleKeyboardStart);
    node.addEventListener('keyup', handleKeyboardStop);
    destroyed = false;
  }

  function destroy() {
    node.classList.remove('s-ripple-container');
    node.removeEventListener('pointerdown', handleStart);
    node.removeEventListener('pointerup', handleStop);
    node.removeEventListener('pointerleave', handleStop);
    node.removeEventListener('keydown', handleKeyboardStart);
    node.removeEventListener('keyup', handleKeyboardStop);
    destroyed = true;
  }

  if (options) setup();

  return {
    update(newOptions) {
      options = newOptions;
      if (options && destroyed) setup();
      else if (!(options || destroyed)) destroy();
    },
    destroy,
  };
};

/* node_modules/svelte-materialify/dist/components/MaterialApp/MaterialApp.svelte generated by Svelte v3.42.1 */

const file$4 = "node_modules/svelte-materialify/dist/components/MaterialApp/MaterialApp.svelte";

function add_css$4(target) {
	append_styles(target, "svelte-74gxk7", "@charset \"UTF-8\";.theme--light{--theme-surface:#fff;--theme-text-primary:rgba(0,0,0,0.87);--theme-text-secondary:rgba(0,0,0,0.6);--theme-text-disabled:rgba(0,0,0,0.38);--theme-text-link:#1976d2;--theme-icons-active:rgba(0,0,0,0.54);--theme-icons-inactive:rgba(0,0,0,0.38);--theme-inputs-box:rgba(0,0,0,0.04);--theme-buttons-disabled:rgba(0,0,0,0.26);--theme-tabs:rgba(0,0,0,0.54);--theme-text-fields-filled:rgba(0,0,0,0.06);--theme-text-fields-filled-hover:rgba(0,0,0,0.12);--theme-text-fields-outlined:rgba(0,0,0,0.38);--theme-text-fields-outlined-disabled:rgba(0,0,0,0.26);--theme-text-fields-border:rgba(0,0,0,0.42);--theme-controls-disabled:rgba(0,0,0,0.26);--theme-controls-thumb-inactive:#fff;--theme-controls-thumb-disabled:#fafafa;--theme-controls-track-inactive:rgba(0,0,0,0.38);--theme-controls-track-disabled:rgba(0,0,0,0.12);--theme-tables-active:#f5f5f5;--theme-tables-hover:#eee;--theme-tables-group:#eee;--theme-datatables-row-hover:rgba(0,0,0,0.04);--theme-dividers:rgba(0,0,0,0.12);--theme-chips:#e0e0e0;--theme-cards:#fff;--theme-app-bar:#f5f5f5;--theme-navigation-drawer:#fff;background-color:var(--theme-surface);color:var(--theme-text-primary)}.theme--light a{color:#1976d2}.theme--light .text--primary{color:var(--theme-text-primary)}.theme--light .text--secondary{color:var(--theme-text-secondary)}.theme--light .text--disabled{color:var(--theme-text-disabled)}.theme--dark{--theme-surface:#212121;--theme-icons-active:#fff;--theme-icons-inactive:hsla(0,0%,100%,0.5);--theme-text-primary:#fff;--theme-text-secondary:hsla(0,0%,100%,0.7);--theme-text-disabled:hsla(0,0%,100%,0.5);--theme-text-link:#82b1ff;--theme-inputs-box:#fff;--theme-buttons-disabled:hsla(0,0%,100%,0.3);--theme-tabs:hsla(0,0%,100%,0.6);--theme-text-fields-filled:hsla(0,0%,100%,0.08);--theme-text-fields-filled-hover:hsla(0,0%,100%,0.16);--theme-text-fields-outlined:hsla(0,0%,100%,0.24);--theme-text-fields-outlined-disabled:hsla(0,0%,100%,0.16);--theme-text-fields-border:hsla(0,0%,100%,0.7);--theme-controls-disabled:hsla(0,0%,100%,0.3);--theme-controls-thumb-inactive:#bdbdbd;--theme-controls-thumb-disabled:#424242;--theme-controls-track-inactive:hsla(0,0%,100%,0.3);--theme-controls-track-disabled:hsla(0,0%,100%,0.1);--theme-tables-active:#505050;--theme-tables-hover:#616161;--theme-tables-group:#616161;--theme-datatables-row-hover:hsla(0,0%,100%,0.04);--theme-dividers:hsla(0,0%,100%,0.12);--theme-chips:#555;--theme-cards:#1e1e1e;--theme-app-bar:#272727;--theme-navigation-drawer:#363636;background-color:var(--theme-surface);color:var(--theme-text-primary)}.theme--dark a{color:#82b1ff}.theme--dark .text--primary{color:var(--theme-text-primary)}.theme--dark .text--secondary{color:var(--theme-text-secondary)}.theme--dark .text--disabled{color:var(--theme-text-disabled)}:root{--theme-bp-xs:0;--theme-bp-sm:600px;--theme-bp-md:960px;--theme-bp-lg:1264px;--theme-bp-xl:1904px}html{box-sizing:border-box;-webkit-text-size-adjust:100%;word-break:normal;-moz-tab-size:4;tab-size:4}*,:after,:before{background-repeat:no-repeat;box-sizing:inherit}:after,:before{text-decoration:inherit;vertical-align:inherit}*{padding:0;margin:0}hr{overflow:visible;height:0}details,main{display:block}summary{display:list-item}small{font-size:80%}[hidden]{display:none}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}a{background-color:transparent}a:active,a:hover{outline-width:0}code,kbd,pre,samp{font-family:monospace,monospace}pre{font-size:1em}b,strong{font-weight:bolder}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}input{border-radius:0}[disabled]{cursor:default}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-decoration{-webkit-appearance:none}textarea{overflow:auto;resize:vertical}button,input,optgroup,select,textarea{font:inherit}optgroup{font-weight:700}button{overflow:visible}button,select{text-transform:none}[role=button],[type=button],[type=reset],[type=submit],button{cursor:pointer;color:inherit}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button:-moz-focusring{outline:1px dotted ButtonText}[type=reset],[type=submit],button,html [type=button]{-webkit-appearance:button}button,input,select,textarea{background-color:transparent;border-style:none}select{-moz-appearance:none;-webkit-appearance:none}select::-ms-expand{display:none}select::-ms-value{color:currentColor}legend{border:0;color:inherit;display:table;white-space:normal;max-width:100%}::-webkit-file-upload-button{-webkit-appearance:button;color:inherit;font:inherit}img{border-style:none}progress{vertical-align:baseline}svg:not([fill]){fill:currentColor}@media screen{[hidden~=screen]{display:inherit}[hidden~=screen]:not(:active):not(:focus):not(:target){position:absolute !important;clip:rect(0 0 0 0) !important}}[aria-busy=true]{cursor:progress}[aria-controls]{cursor:pointer}[aria-disabled=true]{cursor:default}.elevation-0{box-shadow:0 0 0 0 rgba(0, 0, 0, 0.2), 0 0 0 0 rgba(0, 0, 0, 0.14), 0 0 0 0 rgba(0, 0, 0, 0.12) !important}.elevation-1{box-shadow:0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12) !important}.elevation-2{box-shadow:0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12) !important}.elevation-3{box-shadow:0 3px 3px -2px rgba(0, 0, 0, 0.2), 0 3px 4px 0 rgba(0, 0, 0, 0.14), 0 1px 8px 0 rgba(0, 0, 0, 0.12) !important}.elevation-4{box-shadow:0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12) !important}.elevation-5{box-shadow:0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 5px 8px 0 rgba(0, 0, 0, 0.14), 0 1px 14px 0 rgba(0, 0, 0, 0.12) !important}.elevation-6{box-shadow:0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12) !important}.elevation-7{box-shadow:0 4px 5px -2px rgba(0, 0, 0, 0.2), 0 7px 10px 1px rgba(0, 0, 0, 0.14), 0 2px 16px 1px rgba(0, 0, 0, 0.12) !important}.elevation-8{box-shadow:0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12) !important}.elevation-9{box-shadow:0 5px 6px -3px rgba(0, 0, 0, 0.2), 0 9px 12px 1px rgba(0, 0, 0, 0.14), 0 3px 16px 2px rgba(0, 0, 0, 0.12) !important}.elevation-10{box-shadow:0 6px 6px -3px rgba(0, 0, 0, 0.2), 0 10px 14px 1px rgba(0, 0, 0, 0.14), 0 4px 18px 3px rgba(0, 0, 0, 0.12) !important}.elevation-11{box-shadow:0 6px 7px -4px rgba(0, 0, 0, 0.2), 0 11px 15px 1px rgba(0, 0, 0, 0.14), 0 4px 20px 3px rgba(0, 0, 0, 0.12) !important}.elevation-12{box-shadow:0 7px 8px -4px rgba(0, 0, 0, 0.2), 0 12px 17px 2px rgba(0, 0, 0, 0.14), 0 5px 22px 4px rgba(0, 0, 0, 0.12) !important}.elevation-13{box-shadow:0 7px 8px -4px rgba(0, 0, 0, 0.2), 0 13px 19px 2px rgba(0, 0, 0, 0.14), 0 5px 24px 4px rgba(0, 0, 0, 0.12) !important}.elevation-14{box-shadow:0 7px 9px -4px rgba(0, 0, 0, 0.2), 0 14px 21px 2px rgba(0, 0, 0, 0.14), 0 5px 26px 4px rgba(0, 0, 0, 0.12) !important}.elevation-15{box-shadow:0 8px 9px -5px rgba(0, 0, 0, 0.2), 0 15px 22px 2px rgba(0, 0, 0, 0.14), 0 6px 28px 5px rgba(0, 0, 0, 0.12) !important}.elevation-16{box-shadow:0 8px 10px -5px rgba(0, 0, 0, 0.2), 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12) !important}.elevation-17{box-shadow:0 8px 11px -5px rgba(0, 0, 0, 0.2), 0 17px 26px 2px rgba(0, 0, 0, 0.14), 0 6px 32px 5px rgba(0, 0, 0, 0.12) !important}.elevation-18{box-shadow:0 9px 11px -5px rgba(0, 0, 0, 0.2), 0 18px 28px 2px rgba(0, 0, 0, 0.14), 0 7px 34px 6px rgba(0, 0, 0, 0.12) !important}.elevation-19{box-shadow:0 9px 12px -6px rgba(0, 0, 0, 0.2), 0 19px 29px 2px rgba(0, 0, 0, 0.14), 0 7px 36px 6px rgba(0, 0, 0, 0.12) !important}.elevation-20{box-shadow:0 10px 13px -6px rgba(0, 0, 0, 0.2), 0 20px 31px 3px rgba(0, 0, 0, 0.14), 0 8px 38px 7px rgba(0, 0, 0, 0.12) !important}.elevation-21{box-shadow:0 10px 13px -6px rgba(0, 0, 0, 0.2), 0 21px 33px 3px rgba(0, 0, 0, 0.14), 0 8px 40px 7px rgba(0, 0, 0, 0.12) !important}.elevation-22{box-shadow:0 10px 14px -6px rgba(0, 0, 0, 0.2), 0 22px 35px 3px rgba(0, 0, 0, 0.14), 0 8px 42px 7px rgba(0, 0, 0, 0.12) !important}.elevation-23{box-shadow:0 11px 14px -7px rgba(0, 0, 0, 0.2), 0 23px 36px 3px rgba(0, 0, 0, 0.14), 0 9px 44px 8px rgba(0, 0, 0, 0.12) !important}.elevation-24{box-shadow:0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12) !important}.red{background-color:#f44336 !important;border-color:#f44336 !important}.red-text{color:#f44336 !important;caret-color:#f44336 !important}.red.base{background-color:#f44336 !important;border-color:#f44336 !important}.red-text.text-base{color:#f44336 !important;caret-color:#f44336 !important}.red.lighten-5{background-color:#ffebee !important;border-color:#ffebee !important}.red-text.text-lighten-5{color:#ffebee !important;caret-color:#ffebee !important}.red.lighten-4{background-color:#ffcdd2 !important;border-color:#ffcdd2 !important}.red-text.text-lighten-4{color:#ffcdd2 !important;caret-color:#ffcdd2 !important}.red.lighten-3{background-color:#ef9a9a !important;border-color:#ef9a9a !important}.red-text.text-lighten-3{color:#ef9a9a !important;caret-color:#ef9a9a !important}.red.lighten-2{background-color:#e57373 !important;border-color:#e57373 !important}.red-text.text-lighten-2{color:#e57373 !important;caret-color:#e57373 !important}.red.lighten-1{background-color:#ef5350 !important;border-color:#ef5350 !important}.red-text.text-lighten-1{color:#ef5350 !important;caret-color:#ef5350 !important}.red.darken-1{background-color:#e53935 !important;border-color:#e53935 !important}.red-text.text-darken-1{color:#e53935 !important;caret-color:#e53935 !important}.red.darken-2{background-color:#d32f2f !important;border-color:#d32f2f !important}.red-text.text-darken-2{color:#d32f2f !important;caret-color:#d32f2f !important}.red.darken-3{background-color:#c62828 !important;border-color:#c62828 !important}.red-text.text-darken-3{color:#c62828 !important;caret-color:#c62828 !important}.red.darken-4{background-color:#b71c1c !important;border-color:#b71c1c !important}.red-text.text-darken-4{color:#b71c1c !important;caret-color:#b71c1c !important}.red.accent-1{background-color:#ff8a80 !important;border-color:#ff8a80 !important}.red-text.text-accent-1{color:#ff8a80 !important;caret-color:#ff8a80 !important}.red.accent-2{background-color:#ff5252 !important;border-color:#ff5252 !important}.red-text.text-accent-2{color:#ff5252 !important;caret-color:#ff5252 !important}.red.accent-3{background-color:#ff1744 !important;border-color:#ff1744 !important}.red-text.text-accent-3{color:#ff1744 !important;caret-color:#ff1744 !important}.red.accent-4{background-color:#d50000 !important;border-color:#d50000 !important}.red-text.text-accent-4{color:#d50000 !important;caret-color:#d50000 !important}.pink{background-color:#e91e63 !important;border-color:#e91e63 !important}.pink-text{color:#e91e63 !important;caret-color:#e91e63 !important}.pink.base{background-color:#e91e63 !important;border-color:#e91e63 !important}.pink-text.text-base{color:#e91e63 !important;caret-color:#e91e63 !important}.pink.lighten-5{background-color:#fce4ec !important;border-color:#fce4ec !important}.pink-text.text-lighten-5{color:#fce4ec !important;caret-color:#fce4ec !important}.pink.lighten-4{background-color:#f8bbd0 !important;border-color:#f8bbd0 !important}.pink-text.text-lighten-4{color:#f8bbd0 !important;caret-color:#f8bbd0 !important}.pink.lighten-3{background-color:#f48fb1 !important;border-color:#f48fb1 !important}.pink-text.text-lighten-3{color:#f48fb1 !important;caret-color:#f48fb1 !important}.pink.lighten-2{background-color:#f06292 !important;border-color:#f06292 !important}.pink-text.text-lighten-2{color:#f06292 !important;caret-color:#f06292 !important}.pink.lighten-1{background-color:#ec407a !important;border-color:#ec407a !important}.pink-text.text-lighten-1{color:#ec407a !important;caret-color:#ec407a !important}.pink.darken-1{background-color:#d81b60 !important;border-color:#d81b60 !important}.pink-text.text-darken-1{color:#d81b60 !important;caret-color:#d81b60 !important}.pink.darken-2{background-color:#c2185b !important;border-color:#c2185b !important}.pink-text.text-darken-2{color:#c2185b !important;caret-color:#c2185b !important}.pink.darken-3{background-color:#ad1457 !important;border-color:#ad1457 !important}.pink-text.text-darken-3{color:#ad1457 !important;caret-color:#ad1457 !important}.pink.darken-4{background-color:#880e4f !important;border-color:#880e4f !important}.pink-text.text-darken-4{color:#880e4f !important;caret-color:#880e4f !important}.pink.accent-1{background-color:#ff80ab !important;border-color:#ff80ab !important}.pink-text.text-accent-1{color:#ff80ab !important;caret-color:#ff80ab !important}.pink.accent-2{background-color:#ff4081 !important;border-color:#ff4081 !important}.pink-text.text-accent-2{color:#ff4081 !important;caret-color:#ff4081 !important}.pink.accent-3{background-color:#f50057 !important;border-color:#f50057 !important}.pink-text.text-accent-3{color:#f50057 !important;caret-color:#f50057 !important}.pink.accent-4{background-color:#c51162 !important;border-color:#c51162 !important}.pink-text.text-accent-4{color:#c51162 !important;caret-color:#c51162 !important}.purple{background-color:#9c27b0 !important;border-color:#9c27b0 !important}.purple-text{color:#9c27b0 !important;caret-color:#9c27b0 !important}.purple.base{background-color:#9c27b0 !important;border-color:#9c27b0 !important}.purple-text.text-base{color:#9c27b0 !important;caret-color:#9c27b0 !important}.purple.lighten-5{background-color:#f3e5f5 !important;border-color:#f3e5f5 !important}.purple-text.text-lighten-5{color:#f3e5f5 !important;caret-color:#f3e5f5 !important}.purple.lighten-4{background-color:#e1bee7 !important;border-color:#e1bee7 !important}.purple-text.text-lighten-4{color:#e1bee7 !important;caret-color:#e1bee7 !important}.purple.lighten-3{background-color:#ce93d8 !important;border-color:#ce93d8 !important}.purple-text.text-lighten-3{color:#ce93d8 !important;caret-color:#ce93d8 !important}.purple.lighten-2{background-color:#ba68c8 !important;border-color:#ba68c8 !important}.purple-text.text-lighten-2{color:#ba68c8 !important;caret-color:#ba68c8 !important}.purple.lighten-1{background-color:#ab47bc !important;border-color:#ab47bc !important}.purple-text.text-lighten-1{color:#ab47bc !important;caret-color:#ab47bc !important}.purple.darken-1{background-color:#8e24aa !important;border-color:#8e24aa !important}.purple-text.text-darken-1{color:#8e24aa !important;caret-color:#8e24aa !important}.purple.darken-2{background-color:#7b1fa2 !important;border-color:#7b1fa2 !important}.purple-text.text-darken-2{color:#7b1fa2 !important;caret-color:#7b1fa2 !important}.purple.darken-3{background-color:#6a1b9a !important;border-color:#6a1b9a !important}.purple-text.text-darken-3{color:#6a1b9a !important;caret-color:#6a1b9a !important}.purple.darken-4{background-color:#4a148c !important;border-color:#4a148c !important}.purple-text.text-darken-4{color:#4a148c !important;caret-color:#4a148c !important}.purple.accent-1{background-color:#ea80fc !important;border-color:#ea80fc !important}.purple-text.text-accent-1{color:#ea80fc !important;caret-color:#ea80fc !important}.purple.accent-2{background-color:#e040fb !important;border-color:#e040fb !important}.purple-text.text-accent-2{color:#e040fb !important;caret-color:#e040fb !important}.purple.accent-3{background-color:#d500f9 !important;border-color:#d500f9 !important}.purple-text.text-accent-3{color:#d500f9 !important;caret-color:#d500f9 !important}.purple.accent-4{background-color:#a0f !important;border-color:#a0f !important}.purple-text.text-accent-4{color:#a0f !important;caret-color:#a0f !important}.deep-purple{background-color:#673ab7 !important;border-color:#673ab7 !important}.deep-purple-text{color:#673ab7 !important;caret-color:#673ab7 !important}.deep-purple.base{background-color:#673ab7 !important;border-color:#673ab7 !important}.deep-purple-text.text-base{color:#673ab7 !important;caret-color:#673ab7 !important}.deep-purple.lighten-5{background-color:#ede7f6 !important;border-color:#ede7f6 !important}.deep-purple-text.text-lighten-5{color:#ede7f6 !important;caret-color:#ede7f6 !important}.deep-purple.lighten-4{background-color:#d1c4e9 !important;border-color:#d1c4e9 !important}.deep-purple-text.text-lighten-4{color:#d1c4e9 !important;caret-color:#d1c4e9 !important}.deep-purple.lighten-3{background-color:#b39ddb !important;border-color:#b39ddb !important}.deep-purple-text.text-lighten-3{color:#b39ddb !important;caret-color:#b39ddb !important}.deep-purple.lighten-2{background-color:#9575cd !important;border-color:#9575cd !important}.deep-purple-text.text-lighten-2{color:#9575cd !important;caret-color:#9575cd !important}.deep-purple.lighten-1{background-color:#7e57c2 !important;border-color:#7e57c2 !important}.deep-purple-text.text-lighten-1{color:#7e57c2 !important;caret-color:#7e57c2 !important}.deep-purple.darken-1{background-color:#5e35b1 !important;border-color:#5e35b1 !important}.deep-purple-text.text-darken-1{color:#5e35b1 !important;caret-color:#5e35b1 !important}.deep-purple.darken-2{background-color:#512da8 !important;border-color:#512da8 !important}.deep-purple-text.text-darken-2{color:#512da8 !important;caret-color:#512da8 !important}.deep-purple.darken-3{background-color:#4527a0 !important;border-color:#4527a0 !important}.deep-purple-text.text-darken-3{color:#4527a0 !important;caret-color:#4527a0 !important}.deep-purple.darken-4{background-color:#311b92 !important;border-color:#311b92 !important}.deep-purple-text.text-darken-4{color:#311b92 !important;caret-color:#311b92 !important}.deep-purple.accent-1{background-color:#b388ff !important;border-color:#b388ff !important}.deep-purple-text.text-accent-1{color:#b388ff !important;caret-color:#b388ff !important}.deep-purple.accent-2{background-color:#7c4dff !important;border-color:#7c4dff !important}.deep-purple-text.text-accent-2{color:#7c4dff !important;caret-color:#7c4dff !important}.deep-purple.accent-3{background-color:#651fff !important;border-color:#651fff !important}.deep-purple-text.text-accent-3{color:#651fff !important;caret-color:#651fff !important}.deep-purple.accent-4{background-color:#6200ea !important;border-color:#6200ea !important}.deep-purple-text.text-accent-4{color:#6200ea !important;caret-color:#6200ea !important}.indigo{background-color:#3f51b5 !important;border-color:#3f51b5 !important}.indigo-text{color:#3f51b5 !important;caret-color:#3f51b5 !important}.indigo.base{background-color:#3f51b5 !important;border-color:#3f51b5 !important}.indigo-text.text-base{color:#3f51b5 !important;caret-color:#3f51b5 !important}.indigo.lighten-5{background-color:#e8eaf6 !important;border-color:#e8eaf6 !important}.indigo-text.text-lighten-5{color:#e8eaf6 !important;caret-color:#e8eaf6 !important}.indigo.lighten-4{background-color:#c5cae9 !important;border-color:#c5cae9 !important}.indigo-text.text-lighten-4{color:#c5cae9 !important;caret-color:#c5cae9 !important}.indigo.lighten-3{background-color:#9fa8da !important;border-color:#9fa8da !important}.indigo-text.text-lighten-3{color:#9fa8da !important;caret-color:#9fa8da !important}.indigo.lighten-2{background-color:#7986cb !important;border-color:#7986cb !important}.indigo-text.text-lighten-2{color:#7986cb !important;caret-color:#7986cb !important}.indigo.lighten-1{background-color:#5c6bc0 !important;border-color:#5c6bc0 !important}.indigo-text.text-lighten-1{color:#5c6bc0 !important;caret-color:#5c6bc0 !important}.indigo.darken-1{background-color:#3949ab !important;border-color:#3949ab !important}.indigo-text.text-darken-1{color:#3949ab !important;caret-color:#3949ab !important}.indigo.darken-2{background-color:#303f9f !important;border-color:#303f9f !important}.indigo-text.text-darken-2{color:#303f9f !important;caret-color:#303f9f !important}.indigo.darken-3{background-color:#283593 !important;border-color:#283593 !important}.indigo-text.text-darken-3{color:#283593 !important;caret-color:#283593 !important}.indigo.darken-4{background-color:#1a237e !important;border-color:#1a237e !important}.indigo-text.text-darken-4{color:#1a237e !important;caret-color:#1a237e !important}.indigo.accent-1{background-color:#8c9eff !important;border-color:#8c9eff !important}.indigo-text.text-accent-1{color:#8c9eff !important;caret-color:#8c9eff !important}.indigo.accent-2{background-color:#536dfe !important;border-color:#536dfe !important}.indigo-text.text-accent-2{color:#536dfe !important;caret-color:#536dfe !important}.indigo.accent-3{background-color:#3d5afe !important;border-color:#3d5afe !important}.indigo-text.text-accent-3{color:#3d5afe !important;caret-color:#3d5afe !important}.indigo.accent-4{background-color:#304ffe !important;border-color:#304ffe !important}.indigo-text.text-accent-4{color:#304ffe !important;caret-color:#304ffe !important}.blue{background-color:#2196f3 !important;border-color:#2196f3 !important}.blue-text{color:#2196f3 !important;caret-color:#2196f3 !important}.blue.base{background-color:#2196f3 !important;border-color:#2196f3 !important}.blue-text.text-base{color:#2196f3 !important;caret-color:#2196f3 !important}.blue.lighten-5{background-color:#e3f2fd !important;border-color:#e3f2fd !important}.blue-text.text-lighten-5{color:#e3f2fd !important;caret-color:#e3f2fd !important}.blue.lighten-4{background-color:#bbdefb !important;border-color:#bbdefb !important}.blue-text.text-lighten-4{color:#bbdefb !important;caret-color:#bbdefb !important}.blue.lighten-3{background-color:#90caf9 !important;border-color:#90caf9 !important}.blue-text.text-lighten-3{color:#90caf9 !important;caret-color:#90caf9 !important}.blue.lighten-2{background-color:#64b5f6 !important;border-color:#64b5f6 !important}.blue-text.text-lighten-2{color:#64b5f6 !important;caret-color:#64b5f6 !important}.blue.lighten-1{background-color:#42a5f5 !important;border-color:#42a5f5 !important}.blue-text.text-lighten-1{color:#42a5f5 !important;caret-color:#42a5f5 !important}.blue.darken-1{background-color:#1e88e5 !important;border-color:#1e88e5 !important}.blue-text.text-darken-1{color:#1e88e5 !important;caret-color:#1e88e5 !important}.blue.darken-2{background-color:#1976d2 !important;border-color:#1976d2 !important}.blue-text.text-darken-2{color:#1976d2 !important;caret-color:#1976d2 !important}.blue.darken-3{background-color:#1565c0 !important;border-color:#1565c0 !important}.blue-text.text-darken-3{color:#1565c0 !important;caret-color:#1565c0 !important}.blue.darken-4{background-color:#0d47a1 !important;border-color:#0d47a1 !important}.blue-text.text-darken-4{color:#0d47a1 !important;caret-color:#0d47a1 !important}.blue.accent-1{background-color:#82b1ff !important;border-color:#82b1ff !important}.blue-text.text-accent-1{color:#82b1ff !important;caret-color:#82b1ff !important}.blue.accent-2{background-color:#448aff !important;border-color:#448aff !important}.blue-text.text-accent-2{color:#448aff !important;caret-color:#448aff !important}.blue.accent-3{background-color:#2979ff !important;border-color:#2979ff !important}.blue-text.text-accent-3{color:#2979ff !important;caret-color:#2979ff !important}.blue.accent-4{background-color:#2962ff !important;border-color:#2962ff !important}.blue-text.text-accent-4{color:#2962ff !important;caret-color:#2962ff !important}.light-blue{background-color:#03a9f4 !important;border-color:#03a9f4 !important}.light-blue-text{color:#03a9f4 !important;caret-color:#03a9f4 !important}.light-blue.base{background-color:#03a9f4 !important;border-color:#03a9f4 !important}.light-blue-text.text-base{color:#03a9f4 !important;caret-color:#03a9f4 !important}.light-blue.lighten-5{background-color:#e1f5fe !important;border-color:#e1f5fe !important}.light-blue-text.text-lighten-5{color:#e1f5fe !important;caret-color:#e1f5fe !important}.light-blue.lighten-4{background-color:#b3e5fc !important;border-color:#b3e5fc !important}.light-blue-text.text-lighten-4{color:#b3e5fc !important;caret-color:#b3e5fc !important}.light-blue.lighten-3{background-color:#81d4fa !important;border-color:#81d4fa !important}.light-blue-text.text-lighten-3{color:#81d4fa !important;caret-color:#81d4fa !important}.light-blue.lighten-2{background-color:#4fc3f7 !important;border-color:#4fc3f7 !important}.light-blue-text.text-lighten-2{color:#4fc3f7 !important;caret-color:#4fc3f7 !important}.light-blue.lighten-1{background-color:#29b6f6 !important;border-color:#29b6f6 !important}.light-blue-text.text-lighten-1{color:#29b6f6 !important;caret-color:#29b6f6 !important}.light-blue.darken-1{background-color:#039be5 !important;border-color:#039be5 !important}.light-blue-text.text-darken-1{color:#039be5 !important;caret-color:#039be5 !important}.light-blue.darken-2{background-color:#0288d1 !important;border-color:#0288d1 !important}.light-blue-text.text-darken-2{color:#0288d1 !important;caret-color:#0288d1 !important}.light-blue.darken-3{background-color:#0277bd !important;border-color:#0277bd !important}.light-blue-text.text-darken-3{color:#0277bd !important;caret-color:#0277bd !important}.light-blue.darken-4{background-color:#01579b !important;border-color:#01579b !important}.light-blue-text.text-darken-4{color:#01579b !important;caret-color:#01579b !important}.light-blue.accent-1{background-color:#80d8ff !important;border-color:#80d8ff !important}.light-blue-text.text-accent-1{color:#80d8ff !important;caret-color:#80d8ff !important}.light-blue.accent-2{background-color:#40c4ff !important;border-color:#40c4ff !important}.light-blue-text.text-accent-2{color:#40c4ff !important;caret-color:#40c4ff !important}.light-blue.accent-3{background-color:#00b0ff !important;border-color:#00b0ff !important}.light-blue-text.text-accent-3{color:#00b0ff !important;caret-color:#00b0ff !important}.light-blue.accent-4{background-color:#0091ea !important;border-color:#0091ea !important}.light-blue-text.text-accent-4{color:#0091ea !important;caret-color:#0091ea !important}.cyan{background-color:#00bcd4 !important;border-color:#00bcd4 !important}.cyan-text{color:#00bcd4 !important;caret-color:#00bcd4 !important}.cyan.base{background-color:#00bcd4 !important;border-color:#00bcd4 !important}.cyan-text.text-base{color:#00bcd4 !important;caret-color:#00bcd4 !important}.cyan.lighten-5{background-color:#e0f7fa !important;border-color:#e0f7fa !important}.cyan-text.text-lighten-5{color:#e0f7fa !important;caret-color:#e0f7fa !important}.cyan.lighten-4{background-color:#b2ebf2 !important;border-color:#b2ebf2 !important}.cyan-text.text-lighten-4{color:#b2ebf2 !important;caret-color:#b2ebf2 !important}.cyan.lighten-3{background-color:#80deea !important;border-color:#80deea !important}.cyan-text.text-lighten-3{color:#80deea !important;caret-color:#80deea !important}.cyan.lighten-2{background-color:#4dd0e1 !important;border-color:#4dd0e1 !important}.cyan-text.text-lighten-2{color:#4dd0e1 !important;caret-color:#4dd0e1 !important}.cyan.lighten-1{background-color:#26c6da !important;border-color:#26c6da !important}.cyan-text.text-lighten-1{color:#26c6da !important;caret-color:#26c6da !important}.cyan.darken-1{background-color:#00acc1 !important;border-color:#00acc1 !important}.cyan-text.text-darken-1{color:#00acc1 !important;caret-color:#00acc1 !important}.cyan.darken-2{background-color:#0097a7 !important;border-color:#0097a7 !important}.cyan-text.text-darken-2{color:#0097a7 !important;caret-color:#0097a7 !important}.cyan.darken-3{background-color:#00838f !important;border-color:#00838f !important}.cyan-text.text-darken-3{color:#00838f !important;caret-color:#00838f !important}.cyan.darken-4{background-color:#006064 !important;border-color:#006064 !important}.cyan-text.text-darken-4{color:#006064 !important;caret-color:#006064 !important}.cyan.accent-1{background-color:#84ffff !important;border-color:#84ffff !important}.cyan-text.text-accent-1{color:#84ffff !important;caret-color:#84ffff !important}.cyan.accent-2{background-color:#18ffff !important;border-color:#18ffff !important}.cyan-text.text-accent-2{color:#18ffff !important;caret-color:#18ffff !important}.cyan.accent-3{background-color:#00e5ff !important;border-color:#00e5ff !important}.cyan-text.text-accent-3{color:#00e5ff !important;caret-color:#00e5ff !important}.cyan.accent-4{background-color:#00b8d4 !important;border-color:#00b8d4 !important}.cyan-text.text-accent-4{color:#00b8d4 !important;caret-color:#00b8d4 !important}.teal{background-color:#009688 !important;border-color:#009688 !important}.teal-text{color:#009688 !important;caret-color:#009688 !important}.teal.base{background-color:#009688 !important;border-color:#009688 !important}.teal-text.text-base{color:#009688 !important;caret-color:#009688 !important}.teal.lighten-5{background-color:#e0f2f1 !important;border-color:#e0f2f1 !important}.teal-text.text-lighten-5{color:#e0f2f1 !important;caret-color:#e0f2f1 !important}.teal.lighten-4{background-color:#b2dfdb !important;border-color:#b2dfdb !important}.teal-text.text-lighten-4{color:#b2dfdb !important;caret-color:#b2dfdb !important}.teal.lighten-3{background-color:#80cbc4 !important;border-color:#80cbc4 !important}.teal-text.text-lighten-3{color:#80cbc4 !important;caret-color:#80cbc4 !important}.teal.lighten-2{background-color:#4db6ac !important;border-color:#4db6ac !important}.teal-text.text-lighten-2{color:#4db6ac !important;caret-color:#4db6ac !important}.teal.lighten-1{background-color:#26a69a !important;border-color:#26a69a !important}.teal-text.text-lighten-1{color:#26a69a !important;caret-color:#26a69a !important}.teal.darken-1{background-color:#00897b !important;border-color:#00897b !important}.teal-text.text-darken-1{color:#00897b !important;caret-color:#00897b !important}.teal.darken-2{background-color:#00796b !important;border-color:#00796b !important}.teal-text.text-darken-2{color:#00796b !important;caret-color:#00796b !important}.teal.darken-3{background-color:#00695c !important;border-color:#00695c !important}.teal-text.text-darken-3{color:#00695c !important;caret-color:#00695c !important}.teal.darken-4{background-color:#004d40 !important;border-color:#004d40 !important}.teal-text.text-darken-4{color:#004d40 !important;caret-color:#004d40 !important}.teal.accent-1{background-color:#a7ffeb !important;border-color:#a7ffeb !important}.teal-text.text-accent-1{color:#a7ffeb !important;caret-color:#a7ffeb !important}.teal.accent-2{background-color:#64ffda !important;border-color:#64ffda !important}.teal-text.text-accent-2{color:#64ffda !important;caret-color:#64ffda !important}.teal.accent-3{background-color:#1de9b6 !important;border-color:#1de9b6 !important}.teal-text.text-accent-3{color:#1de9b6 !important;caret-color:#1de9b6 !important}.teal.accent-4{background-color:#00bfa5 !important;border-color:#00bfa5 !important}.teal-text.text-accent-4{color:#00bfa5 !important;caret-color:#00bfa5 !important}.green{background-color:#4caf50 !important;border-color:#4caf50 !important}.green-text{color:#4caf50 !important;caret-color:#4caf50 !important}.green.base{background-color:#4caf50 !important;border-color:#4caf50 !important}.green-text.text-base{color:#4caf50 !important;caret-color:#4caf50 !important}.green.lighten-5{background-color:#e8f5e9 !important;border-color:#e8f5e9 !important}.green-text.text-lighten-5{color:#e8f5e9 !important;caret-color:#e8f5e9 !important}.green.lighten-4{background-color:#c8e6c9 !important;border-color:#c8e6c9 !important}.green-text.text-lighten-4{color:#c8e6c9 !important;caret-color:#c8e6c9 !important}.green.lighten-3{background-color:#a5d6a7 !important;border-color:#a5d6a7 !important}.green-text.text-lighten-3{color:#a5d6a7 !important;caret-color:#a5d6a7 !important}.green.lighten-2{background-color:#81c784 !important;border-color:#81c784 !important}.green-text.text-lighten-2{color:#81c784 !important;caret-color:#81c784 !important}.green.lighten-1{background-color:#66bb6a !important;border-color:#66bb6a !important}.green-text.text-lighten-1{color:#66bb6a !important;caret-color:#66bb6a !important}.green.darken-1{background-color:#43a047 !important;border-color:#43a047 !important}.green-text.text-darken-1{color:#43a047 !important;caret-color:#43a047 !important}.green.darken-2{background-color:#388e3c !important;border-color:#388e3c !important}.green-text.text-darken-2{color:#388e3c !important;caret-color:#388e3c !important}.green.darken-3{background-color:#2e7d32 !important;border-color:#2e7d32 !important}.green-text.text-darken-3{color:#2e7d32 !important;caret-color:#2e7d32 !important}.green.darken-4{background-color:#1b5e20 !important;border-color:#1b5e20 !important}.green-text.text-darken-4{color:#1b5e20 !important;caret-color:#1b5e20 !important}.green.accent-1{background-color:#b9f6ca !important;border-color:#b9f6ca !important}.green-text.text-accent-1{color:#b9f6ca !important;caret-color:#b9f6ca !important}.green.accent-2{background-color:#69f0ae !important;border-color:#69f0ae !important}.green-text.text-accent-2{color:#69f0ae !important;caret-color:#69f0ae !important}.green.accent-3{background-color:#00e676 !important;border-color:#00e676 !important}.green-text.text-accent-3{color:#00e676 !important;caret-color:#00e676 !important}.green.accent-4{background-color:#00c853 !important;border-color:#00c853 !important}.green-text.text-accent-4{color:#00c853 !important;caret-color:#00c853 !important}.light-green{background-color:#8bc34a !important;border-color:#8bc34a !important}.light-green-text{color:#8bc34a !important;caret-color:#8bc34a !important}.light-green.base{background-color:#8bc34a !important;border-color:#8bc34a !important}.light-green-text.text-base{color:#8bc34a !important;caret-color:#8bc34a !important}.light-green.lighten-5{background-color:#f1f8e9 !important;border-color:#f1f8e9 !important}.light-green-text.text-lighten-5{color:#f1f8e9 !important;caret-color:#f1f8e9 !important}.light-green.lighten-4{background-color:#dcedc8 !important;border-color:#dcedc8 !important}.light-green-text.text-lighten-4{color:#dcedc8 !important;caret-color:#dcedc8 !important}.light-green.lighten-3{background-color:#c5e1a5 !important;border-color:#c5e1a5 !important}.light-green-text.text-lighten-3{color:#c5e1a5 !important;caret-color:#c5e1a5 !important}.light-green.lighten-2{background-color:#aed581 !important;border-color:#aed581 !important}.light-green-text.text-lighten-2{color:#aed581 !important;caret-color:#aed581 !important}.light-green.lighten-1{background-color:#9ccc65 !important;border-color:#9ccc65 !important}.light-green-text.text-lighten-1{color:#9ccc65 !important;caret-color:#9ccc65 !important}.light-green.darken-1{background-color:#7cb342 !important;border-color:#7cb342 !important}.light-green-text.text-darken-1{color:#7cb342 !important;caret-color:#7cb342 !important}.light-green.darken-2{background-color:#689f38 !important;border-color:#689f38 !important}.light-green-text.text-darken-2{color:#689f38 !important;caret-color:#689f38 !important}.light-green.darken-3{background-color:#558b2f !important;border-color:#558b2f !important}.light-green-text.text-darken-3{color:#558b2f !important;caret-color:#558b2f !important}.light-green.darken-4{background-color:#33691e !important;border-color:#33691e !important}.light-green-text.text-darken-4{color:#33691e !important;caret-color:#33691e !important}.light-green.accent-1{background-color:#ccff90 !important;border-color:#ccff90 !important}.light-green-text.text-accent-1{color:#ccff90 !important;caret-color:#ccff90 !important}.light-green.accent-2{background-color:#b2ff59 !important;border-color:#b2ff59 !important}.light-green-text.text-accent-2{color:#b2ff59 !important;caret-color:#b2ff59 !important}.light-green.accent-3{background-color:#76ff03 !important;border-color:#76ff03 !important}.light-green-text.text-accent-3{color:#76ff03 !important;caret-color:#76ff03 !important}.light-green.accent-4{background-color:#64dd17 !important;border-color:#64dd17 !important}.light-green-text.text-accent-4{color:#64dd17 !important;caret-color:#64dd17 !important}.lime{background-color:#cddc39 !important;border-color:#cddc39 !important}.lime-text{color:#cddc39 !important;caret-color:#cddc39 !important}.lime.base{background-color:#cddc39 !important;border-color:#cddc39 !important}.lime-text.text-base{color:#cddc39 !important;caret-color:#cddc39 !important}.lime.lighten-5{background-color:#f9fbe7 !important;border-color:#f9fbe7 !important}.lime-text.text-lighten-5{color:#f9fbe7 !important;caret-color:#f9fbe7 !important}.lime.lighten-4{background-color:#f0f4c3 !important;border-color:#f0f4c3 !important}.lime-text.text-lighten-4{color:#f0f4c3 !important;caret-color:#f0f4c3 !important}.lime.lighten-3{background-color:#e6ee9c !important;border-color:#e6ee9c !important}.lime-text.text-lighten-3{color:#e6ee9c !important;caret-color:#e6ee9c !important}.lime.lighten-2{background-color:#dce775 !important;border-color:#dce775 !important}.lime-text.text-lighten-2{color:#dce775 !important;caret-color:#dce775 !important}.lime.lighten-1{background-color:#d4e157 !important;border-color:#d4e157 !important}.lime-text.text-lighten-1{color:#d4e157 !important;caret-color:#d4e157 !important}.lime.darken-1{background-color:#c0ca33 !important;border-color:#c0ca33 !important}.lime-text.text-darken-1{color:#c0ca33 !important;caret-color:#c0ca33 !important}.lime.darken-2{background-color:#afb42b !important;border-color:#afb42b !important}.lime-text.text-darken-2{color:#afb42b !important;caret-color:#afb42b !important}.lime.darken-3{background-color:#9e9d24 !important;border-color:#9e9d24 !important}.lime-text.text-darken-3{color:#9e9d24 !important;caret-color:#9e9d24 !important}.lime.darken-4{background-color:#827717 !important;border-color:#827717 !important}.lime-text.text-darken-4{color:#827717 !important;caret-color:#827717 !important}.lime.accent-1{background-color:#f4ff81 !important;border-color:#f4ff81 !important}.lime-text.text-accent-1{color:#f4ff81 !important;caret-color:#f4ff81 !important}.lime.accent-2{background-color:#eeff41 !important;border-color:#eeff41 !important}.lime-text.text-accent-2{color:#eeff41 !important;caret-color:#eeff41 !important}.lime.accent-3{background-color:#c6ff00 !important;border-color:#c6ff00 !important}.lime-text.text-accent-3{color:#c6ff00 !important;caret-color:#c6ff00 !important}.lime.accent-4{background-color:#aeea00 !important;border-color:#aeea00 !important}.lime-text.text-accent-4{color:#aeea00 !important;caret-color:#aeea00 !important}.yellow{background-color:#ffeb3b !important;border-color:#ffeb3b !important}.yellow-text{color:#ffeb3b !important;caret-color:#ffeb3b !important}.yellow.base{background-color:#ffeb3b !important;border-color:#ffeb3b !important}.yellow-text.text-base{color:#ffeb3b !important;caret-color:#ffeb3b !important}.yellow.lighten-5{background-color:#fffde7 !important;border-color:#fffde7 !important}.yellow-text.text-lighten-5{color:#fffde7 !important;caret-color:#fffde7 !important}.yellow.lighten-4{background-color:#fff9c4 !important;border-color:#fff9c4 !important}.yellow-text.text-lighten-4{color:#fff9c4 !important;caret-color:#fff9c4 !important}.yellow.lighten-3{background-color:#fff59d !important;border-color:#fff59d !important}.yellow-text.text-lighten-3{color:#fff59d !important;caret-color:#fff59d !important}.yellow.lighten-2{background-color:#fff176 !important;border-color:#fff176 !important}.yellow-text.text-lighten-2{color:#fff176 !important;caret-color:#fff176 !important}.yellow.lighten-1{background-color:#ffee58 !important;border-color:#ffee58 !important}.yellow-text.text-lighten-1{color:#ffee58 !important;caret-color:#ffee58 !important}.yellow.darken-1{background-color:#fdd835 !important;border-color:#fdd835 !important}.yellow-text.text-darken-1{color:#fdd835 !important;caret-color:#fdd835 !important}.yellow.darken-2{background-color:#fbc02d !important;border-color:#fbc02d !important}.yellow-text.text-darken-2{color:#fbc02d !important;caret-color:#fbc02d !important}.yellow.darken-3{background-color:#f9a825 !important;border-color:#f9a825 !important}.yellow-text.text-darken-3{color:#f9a825 !important;caret-color:#f9a825 !important}.yellow.darken-4{background-color:#f57f17 !important;border-color:#f57f17 !important}.yellow-text.text-darken-4{color:#f57f17 !important;caret-color:#f57f17 !important}.yellow.accent-1{background-color:#ffff8d !important;border-color:#ffff8d !important}.yellow-text.text-accent-1{color:#ffff8d !important;caret-color:#ffff8d !important}.yellow.accent-2{background-color:#ff0 !important;border-color:#ff0 !important}.yellow-text.text-accent-2{color:#ff0 !important;caret-color:#ff0 !important}.yellow.accent-3{background-color:#ffea00 !important;border-color:#ffea00 !important}.yellow-text.text-accent-3{color:#ffea00 !important;caret-color:#ffea00 !important}.yellow.accent-4{background-color:#ffd600 !important;border-color:#ffd600 !important}.yellow-text.text-accent-4{color:#ffd600 !important;caret-color:#ffd600 !important}.amber{background-color:#ffc107 !important;border-color:#ffc107 !important}.amber-text{color:#ffc107 !important;caret-color:#ffc107 !important}.amber.base{background-color:#ffc107 !important;border-color:#ffc107 !important}.amber-text.text-base{color:#ffc107 !important;caret-color:#ffc107 !important}.amber.lighten-5{background-color:#fff8e1 !important;border-color:#fff8e1 !important}.amber-text.text-lighten-5{color:#fff8e1 !important;caret-color:#fff8e1 !important}.amber.lighten-4{background-color:#ffecb3 !important;border-color:#ffecb3 !important}.amber-text.text-lighten-4{color:#ffecb3 !important;caret-color:#ffecb3 !important}.amber.lighten-3{background-color:#ffe082 !important;border-color:#ffe082 !important}.amber-text.text-lighten-3{color:#ffe082 !important;caret-color:#ffe082 !important}.amber.lighten-2{background-color:#ffd54f !important;border-color:#ffd54f !important}.amber-text.text-lighten-2{color:#ffd54f !important;caret-color:#ffd54f !important}.amber.lighten-1{background-color:#ffca28 !important;border-color:#ffca28 !important}.amber-text.text-lighten-1{color:#ffca28 !important;caret-color:#ffca28 !important}.amber.darken-1{background-color:#ffb300 !important;border-color:#ffb300 !important}.amber-text.text-darken-1{color:#ffb300 !important;caret-color:#ffb300 !important}.amber.darken-2{background-color:#ffa000 !important;border-color:#ffa000 !important}.amber-text.text-darken-2{color:#ffa000 !important;caret-color:#ffa000 !important}.amber.darken-3{background-color:#ff8f00 !important;border-color:#ff8f00 !important}.amber-text.text-darken-3{color:#ff8f00 !important;caret-color:#ff8f00 !important}.amber.darken-4{background-color:#ff6f00 !important;border-color:#ff6f00 !important}.amber-text.text-darken-4{color:#ff6f00 !important;caret-color:#ff6f00 !important}.amber.accent-1{background-color:#ffe57f !important;border-color:#ffe57f !important}.amber-text.text-accent-1{color:#ffe57f !important;caret-color:#ffe57f !important}.amber.accent-2{background-color:#ffd740 !important;border-color:#ffd740 !important}.amber-text.text-accent-2{color:#ffd740 !important;caret-color:#ffd740 !important}.amber.accent-3{background-color:#ffc400 !important;border-color:#ffc400 !important}.amber-text.text-accent-3{color:#ffc400 !important;caret-color:#ffc400 !important}.amber.accent-4{background-color:#ffab00 !important;border-color:#ffab00 !important}.amber-text.text-accent-4{color:#ffab00 !important;caret-color:#ffab00 !important}.orange{background-color:#ff9800 !important;border-color:#ff9800 !important}.orange-text{color:#ff9800 !important;caret-color:#ff9800 !important}.orange.base{background-color:#ff9800 !important;border-color:#ff9800 !important}.orange-text.text-base{color:#ff9800 !important;caret-color:#ff9800 !important}.orange.lighten-5{background-color:#fff3e0 !important;border-color:#fff3e0 !important}.orange-text.text-lighten-5{color:#fff3e0 !important;caret-color:#fff3e0 !important}.orange.lighten-4{background-color:#ffe0b2 !important;border-color:#ffe0b2 !important}.orange-text.text-lighten-4{color:#ffe0b2 !important;caret-color:#ffe0b2 !important}.orange.lighten-3{background-color:#ffcc80 !important;border-color:#ffcc80 !important}.orange-text.text-lighten-3{color:#ffcc80 !important;caret-color:#ffcc80 !important}.orange.lighten-2{background-color:#ffb74d !important;border-color:#ffb74d !important}.orange-text.text-lighten-2{color:#ffb74d !important;caret-color:#ffb74d !important}.orange.lighten-1{background-color:#ffa726 !important;border-color:#ffa726 !important}.orange-text.text-lighten-1{color:#ffa726 !important;caret-color:#ffa726 !important}.orange.darken-1{background-color:#fb8c00 !important;border-color:#fb8c00 !important}.orange-text.text-darken-1{color:#fb8c00 !important;caret-color:#fb8c00 !important}.orange.darken-2{background-color:#f57c00 !important;border-color:#f57c00 !important}.orange-text.text-darken-2{color:#f57c00 !important;caret-color:#f57c00 !important}.orange.darken-3{background-color:#ef6c00 !important;border-color:#ef6c00 !important}.orange-text.text-darken-3{color:#ef6c00 !important;caret-color:#ef6c00 !important}.orange.darken-4{background-color:#e65100 !important;border-color:#e65100 !important}.orange-text.text-darken-4{color:#e65100 !important;caret-color:#e65100 !important}.orange.accent-1{background-color:#ffd180 !important;border-color:#ffd180 !important}.orange-text.text-accent-1{color:#ffd180 !important;caret-color:#ffd180 !important}.orange.accent-2{background-color:#ffab40 !important;border-color:#ffab40 !important}.orange-text.text-accent-2{color:#ffab40 !important;caret-color:#ffab40 !important}.orange.accent-3{background-color:#ff9100 !important;border-color:#ff9100 !important}.orange-text.text-accent-3{color:#ff9100 !important;caret-color:#ff9100 !important}.orange.accent-4{background-color:#ff6d00 !important;border-color:#ff6d00 !important}.orange-text.text-accent-4{color:#ff6d00 !important;caret-color:#ff6d00 !important}.deep-orange{background-color:#ff5722 !important;border-color:#ff5722 !important}.deep-orange-text{color:#ff5722 !important;caret-color:#ff5722 !important}.deep-orange.base{background-color:#ff5722 !important;border-color:#ff5722 !important}.deep-orange-text.text-base{color:#ff5722 !important;caret-color:#ff5722 !important}.deep-orange.lighten-5{background-color:#fbe9e7 !important;border-color:#fbe9e7 !important}.deep-orange-text.text-lighten-5{color:#fbe9e7 !important;caret-color:#fbe9e7 !important}.deep-orange.lighten-4{background-color:#ffccbc !important;border-color:#ffccbc !important}.deep-orange-text.text-lighten-4{color:#ffccbc !important;caret-color:#ffccbc !important}.deep-orange.lighten-3{background-color:#ffab91 !important;border-color:#ffab91 !important}.deep-orange-text.text-lighten-3{color:#ffab91 !important;caret-color:#ffab91 !important}.deep-orange.lighten-2{background-color:#ff8a65 !important;border-color:#ff8a65 !important}.deep-orange-text.text-lighten-2{color:#ff8a65 !important;caret-color:#ff8a65 !important}.deep-orange.lighten-1{background-color:#ff7043 !important;border-color:#ff7043 !important}.deep-orange-text.text-lighten-1{color:#ff7043 !important;caret-color:#ff7043 !important}.deep-orange.darken-1{background-color:#f4511e !important;border-color:#f4511e !important}.deep-orange-text.text-darken-1{color:#f4511e !important;caret-color:#f4511e !important}.deep-orange.darken-2{background-color:#e64a19 !important;border-color:#e64a19 !important}.deep-orange-text.text-darken-2{color:#e64a19 !important;caret-color:#e64a19 !important}.deep-orange.darken-3{background-color:#d84315 !important;border-color:#d84315 !important}.deep-orange-text.text-darken-3{color:#d84315 !important;caret-color:#d84315 !important}.deep-orange.darken-4{background-color:#bf360c !important;border-color:#bf360c !important}.deep-orange-text.text-darken-4{color:#bf360c !important;caret-color:#bf360c !important}.deep-orange.accent-1{background-color:#ff9e80 !important;border-color:#ff9e80 !important}.deep-orange-text.text-accent-1{color:#ff9e80 !important;caret-color:#ff9e80 !important}.deep-orange.accent-2{background-color:#ff6e40 !important;border-color:#ff6e40 !important}.deep-orange-text.text-accent-2{color:#ff6e40 !important;caret-color:#ff6e40 !important}.deep-orange.accent-3{background-color:#ff3d00 !important;border-color:#ff3d00 !important}.deep-orange-text.text-accent-3{color:#ff3d00 !important;caret-color:#ff3d00 !important}.deep-orange.accent-4{background-color:#dd2c00 !important;border-color:#dd2c00 !important}.deep-orange-text.text-accent-4{color:#dd2c00 !important;caret-color:#dd2c00 !important}.brown{background-color:#795548 !important;border-color:#795548 !important}.brown-text{color:#795548 !important;caret-color:#795548 !important}.brown.base{background-color:#795548 !important;border-color:#795548 !important}.brown-text.text-base{color:#795548 !important;caret-color:#795548 !important}.brown.lighten-5{background-color:#efebe9 !important;border-color:#efebe9 !important}.brown-text.text-lighten-5{color:#efebe9 !important;caret-color:#efebe9 !important}.brown.lighten-4{background-color:#d7ccc8 !important;border-color:#d7ccc8 !important}.brown-text.text-lighten-4{color:#d7ccc8 !important;caret-color:#d7ccc8 !important}.brown.lighten-3{background-color:#bcaaa4 !important;border-color:#bcaaa4 !important}.brown-text.text-lighten-3{color:#bcaaa4 !important;caret-color:#bcaaa4 !important}.brown.lighten-2{background-color:#a1887f !important;border-color:#a1887f !important}.brown-text.text-lighten-2{color:#a1887f !important;caret-color:#a1887f !important}.brown.lighten-1{background-color:#8d6e63 !important;border-color:#8d6e63 !important}.brown-text.text-lighten-1{color:#8d6e63 !important;caret-color:#8d6e63 !important}.brown.darken-1{background-color:#6d4c41 !important;border-color:#6d4c41 !important}.brown-text.text-darken-1{color:#6d4c41 !important;caret-color:#6d4c41 !important}.brown.darken-2{background-color:#5d4037 !important;border-color:#5d4037 !important}.brown-text.text-darken-2{color:#5d4037 !important;caret-color:#5d4037 !important}.brown.darken-3{background-color:#4e342e !important;border-color:#4e342e !important}.brown-text.text-darken-3{color:#4e342e !important;caret-color:#4e342e !important}.brown.darken-4{background-color:#3e2723 !important;border-color:#3e2723 !important}.brown-text.text-darken-4{color:#3e2723 !important;caret-color:#3e2723 !important}.blue-grey{background-color:#607d8b !important;border-color:#607d8b !important}.blue-grey-text{color:#607d8b !important;caret-color:#607d8b !important}.blue-grey.base{background-color:#607d8b !important;border-color:#607d8b !important}.blue-grey-text.text-base{color:#607d8b !important;caret-color:#607d8b !important}.blue-grey.lighten-5{background-color:#eceff1 !important;border-color:#eceff1 !important}.blue-grey-text.text-lighten-5{color:#eceff1 !important;caret-color:#eceff1 !important}.blue-grey.lighten-4{background-color:#cfd8dc !important;border-color:#cfd8dc !important}.blue-grey-text.text-lighten-4{color:#cfd8dc !important;caret-color:#cfd8dc !important}.blue-grey.lighten-3{background-color:#b0bec5 !important;border-color:#b0bec5 !important}.blue-grey-text.text-lighten-3{color:#b0bec5 !important;caret-color:#b0bec5 !important}.blue-grey.lighten-2{background-color:#90a4ae !important;border-color:#90a4ae !important}.blue-grey-text.text-lighten-2{color:#90a4ae !important;caret-color:#90a4ae !important}.blue-grey.lighten-1{background-color:#78909c !important;border-color:#78909c !important}.blue-grey-text.text-lighten-1{color:#78909c !important;caret-color:#78909c !important}.blue-grey.darken-1{background-color:#546e7a !important;border-color:#546e7a !important}.blue-grey-text.text-darken-1{color:#546e7a !important;caret-color:#546e7a !important}.blue-grey.darken-2{background-color:#455a64 !important;border-color:#455a64 !important}.blue-grey-text.text-darken-2{color:#455a64 !important;caret-color:#455a64 !important}.blue-grey.darken-3{background-color:#37474f !important;border-color:#37474f !important}.blue-grey-text.text-darken-3{color:#37474f !important;caret-color:#37474f !important}.blue-grey.darken-4{background-color:#263238 !important;border-color:#263238 !important}.blue-grey-text.text-darken-4{color:#263238 !important;caret-color:#263238 !important}.grey{background-color:#9e9e9e !important;border-color:#9e9e9e !important}.grey-text{color:#9e9e9e !important;caret-color:#9e9e9e !important}.grey.base{background-color:#9e9e9e !important;border-color:#9e9e9e !important}.grey-text.text-base{color:#9e9e9e !important;caret-color:#9e9e9e !important}.grey.lighten-5{background-color:#fafafa !important;border-color:#fafafa !important}.grey-text.text-lighten-5{color:#fafafa !important;caret-color:#fafafa !important}.grey.lighten-4{background-color:#f5f5f5 !important;border-color:#f5f5f5 !important}.grey-text.text-lighten-4{color:#f5f5f5 !important;caret-color:#f5f5f5 !important}.grey.lighten-3{background-color:#eee !important;border-color:#eee !important}.grey-text.text-lighten-3{color:#eee !important;caret-color:#eee !important}.grey.lighten-2{background-color:#e0e0e0 !important;border-color:#e0e0e0 !important}.grey-text.text-lighten-2{color:#e0e0e0 !important;caret-color:#e0e0e0 !important}.grey.lighten-1{background-color:#bdbdbd !important;border-color:#bdbdbd !important}.grey-text.text-lighten-1{color:#bdbdbd !important;caret-color:#bdbdbd !important}.grey.darken-1{background-color:#757575 !important;border-color:#757575 !important}.grey-text.text-darken-1{color:#757575 !important;caret-color:#757575 !important}.grey.darken-2{background-color:#616161 !important;border-color:#616161 !important}.grey-text.text-darken-2{color:#616161 !important;caret-color:#616161 !important}.grey.darken-3{background-color:#424242 !important;border-color:#424242 !important}.grey-text.text-darken-3{color:#424242 !important;caret-color:#424242 !important}.grey.darken-4{background-color:#212121 !important;border-color:#212121 !important}.grey-text.text-darken-4{color:#212121 !important;caret-color:#212121 !important}.black{background-color:#000 !important;border-color:#000 !important}.black-text{color:#000 !important;caret-color:#000 !important}.white{background-color:#fff !important;border-color:#fff !important}.white-text{color:#fff !important;caret-color:#fff !important}.transparent{background-color:transparent !important;border-color:transparent !important}.transparent-text{color:transparent !important;caret-color:transparent !important}.primary-color{background-color:#6200ee !important;border-color:#6200ee !important}.primary-text{color:#6200ee !important;caret-color:#6200ee !important}.secondary-color{background-color:#1976d2 !important;border-color:#1976d2 !important}.secondary-text{color:#1976d2 !important;caret-color:#1976d2 !important}.success-color{background-color:#4caf50 !important;border-color:#4caf50 !important}.success-text{color:#4caf50 !important;caret-color:#4caf50 !important}.info-color{background-color:#00bcd4 !important;border-color:#00bcd4 !important}.info-text{color:#00bcd4 !important;caret-color:#00bcd4 !important}.warning-color{background-color:#fb8c00 !important;border-color:#fb8c00 !important}.warning-text{color:#fb8c00 !important;caret-color:#fb8c00 !important}.error-color{background-color:#f44336 !important;border-color:#f44336 !important}.error-text{color:#f44336 !important;caret-color:#f44336 !important}.text-left{text-align:left}.text-center{text-align:center}.text-right{text-align:right}@media only screen and (min-width: 600px){.text-sm-left{text-align:left}}@media only screen and (min-width: 960px){.text-md-left{text-align:left}}@media only screen and (min-width: 1264px){.text-lg-left{text-align:left}}@media only screen and (min-width: 1904px){.text-xl-left{text-align:left}}@media only screen and (min-width: 600px){.text-sm-center{text-align:center}}@media only screen and (min-width: 960px){.text-md-center{text-align:center}}@media only screen and (min-width: 1264px){.text-lg-center{text-align:center}}@media only screen and (min-width: 1904px){.text-xl-center{text-align:center}}@media only screen and (min-width: 600px){.text-sm-right{text-align:right}}@media only screen and (min-width: 960px){.text-md-right{text-align:right}}@media only screen and (min-width: 1264px){.text-lg-right{text-align:right}}@media only screen and (min-width: 1904px){.text-xl-right{text-align:right}}.text-decoration-none{text-decoration:none}.text-decoration-overline{text-decoration:overline}.text-decoration-underline{text-decoration:underline}.text-decoration-line-through{text-decoration:line-through}.text-lowercase{text-transform:lowercase}.text-uppercase{text-transform:uppercase}.text-capitalize{text-transform:capitalize}.font-weight-thin{font-weight:100}.font-weight-light{font-weight:300}.font-weight-regular{font-weight:400}.font-weight-medium{font-weight:500}.font-weight-bold{font-weight:700}.font-weight-black{font-weight:900}.font-italic{font-style:italic}.rounded-0{border-radius:0}.rounded-tl-0{border-top-left-radius:0}.rounded-tr-0{border-top-right-radius:0}.rounded-bl-0{border-bottom-left-radius:0}.rounded-br-0{border-bottom-right-radius:0}.rounded-t-0{border-top-left-radius:0;border-top-right-radius:0}.rounded-b-0{border-bottom-right-radius:0}.rounded-b-0,.rounded-l-0{border-bottom-left-radius:0}.rounded-l-0{border-top-left-radius:0}.rounded-r-0{border-top-right-radius:0;border-bottom-right-radius:0}.rounded-sm{border-radius:2px}.rounded-tl-sm{border-top-left-radius:2px}.rounded-tr-sm{border-top-right-radius:2px}.rounded-bl-sm{border-bottom-left-radius:2px}.rounded-br-sm{border-bottom-right-radius:2px}.rounded-t-sm{border-top-left-radius:2px;border-top-right-radius:2px}.rounded-b-sm{border-bottom-right-radius:2px}.rounded-b-sm,.rounded-l-sm{border-bottom-left-radius:2px}.rounded-l-sm{border-top-left-radius:2px}.rounded-r-sm{border-top-right-radius:2px;border-bottom-right-radius:2px}.rounded{border-radius:4px}.rounded-tl{border-top-left-radius:4px}.rounded-tr{border-top-right-radius:4px}.rounded-bl{border-bottom-left-radius:4px}.rounded-br{border-bottom-right-radius:4px}.rounded-t{border-top-left-radius:4px;border-top-right-radius:4px}.rounded-b{border-bottom-right-radius:4px}.rounded-b,.rounded-l{border-bottom-left-radius:4px}.rounded-l{border-top-left-radius:4px}.rounded-r{border-top-right-radius:4px;border-bottom-right-radius:4px}.rounded-lg{border-radius:8px}.rounded-tl-lg{border-top-left-radius:8px}.rounded-tr-lg{border-top-right-radius:8px}.rounded-bl-lg{border-bottom-left-radius:8px}.rounded-br-lg{border-bottom-right-radius:8px}.rounded-t-lg{border-top-left-radius:8px;border-top-right-radius:8px}.rounded-b-lg{border-bottom-right-radius:8px}.rounded-b-lg,.rounded-l-lg{border-bottom-left-radius:8px}.rounded-l-lg{border-top-left-radius:8px}.rounded-r-lg{border-top-right-radius:8px;border-bottom-right-radius:8px}.rounded-xl{border-radius:24px}.rounded-tl-xl{border-top-left-radius:24px}.rounded-tr-xl{border-top-right-radius:24px}.rounded-bl-xl{border-bottom-left-radius:24px}.rounded-br-xl{border-bottom-right-radius:24px}.rounded-t-xl{border-top-left-radius:24px;border-top-right-radius:24px}.rounded-b-xl{border-bottom-right-radius:24px}.rounded-b-xl,.rounded-l-xl{border-bottom-left-radius:24px}.rounded-l-xl{border-top-left-radius:24px}.rounded-r-xl{border-top-right-radius:24px;border-bottom-right-radius:24px}.rounded-pill{border-radius:9999px}.rounded-tl-pill{border-top-left-radius:9999px}.rounded-tr-pill{border-top-right-radius:9999px}.rounded-bl-pill{border-bottom-left-radius:9999px}.rounded-br-pill{border-bottom-right-radius:9999px}.rounded-t-pill{border-top-left-radius:9999px;border-top-right-radius:9999px}.rounded-b-pill{border-bottom-right-radius:9999px}.rounded-b-pill,.rounded-l-pill{border-bottom-left-radius:9999px}.rounded-l-pill{border-top-left-radius:9999px}.rounded-r-pill{border-top-right-radius:9999px;border-bottom-right-radius:9999px}.rounded-circle{border-radius:50%}.rounded-tl-circle{border-top-left-radius:50%}.rounded-tr-circle{border-top-right-radius:50%}.rounded-bl-circle{border-bottom-left-radius:50%}.rounded-br-circle{border-bottom-right-radius:50%}.rounded-t-circle{border-top-left-radius:50%;border-top-right-radius:50%}.rounded-b-circle{border-bottom-left-radius:50%;border-bottom-right-radius:50%}.rounded-l-circle{border-top-left-radius:50%;border-bottom-left-radius:50%}.rounded-r-circle{border-top-right-radius:50%;border-bottom-right-radius:50%}.ma-0,.ma-n0{margin:0 !important}.ml-0,.ml-n0{margin-left:0 !important}.mr-0,.mr-n0{margin-right:0 !important}.mt-0,.mt-n0{margin-top:0 !important}.mb-0,.mb-n0{margin-bottom:0 !important}.pa-0,.pa-n0{padding:0 !important}.pl-0,.pl-n0{padding-left:0 !important}.pr-0,.pr-n0{padding-right:0 !important}.pt-0,.pt-n0{padding-top:0 !important}.pb-0,.pb-n0{padding-bottom:0 !important}.ma-1{margin:4px !important}.ma-n1{margin:-4px !important}.ml-1{margin-left:4px !important}.ml-n1{margin-left:-4px !important}.mr-1{margin-right:4px !important}.mr-n1{margin-right:-4px !important}.mt-1{margin-top:4px !important}.mt-n1{margin-top:-4px !important}.mb-1{margin-bottom:4px !important}.mb-n1{margin-bottom:-4px !important}.pa-1{padding:4px !important}.pa-n1{padding:-4px !important}.pl-1{padding-left:4px !important}.pl-n1{padding-left:-4px !important}.pr-1{padding-right:4px !important}.pr-n1{padding-right:-4px !important}.pt-1{padding-top:4px !important}.pt-n1{padding-top:-4px !important}.pb-1{padding-bottom:4px !important}.pb-n1{padding-bottom:-4px !important}.ma-2{margin:8px !important}.ma-n2{margin:-8px !important}.ml-2{margin-left:8px !important}.ml-n2{margin-left:-8px !important}.mr-2{margin-right:8px !important}.mr-n2{margin-right:-8px !important}.mt-2{margin-top:8px !important}.mt-n2{margin-top:-8px !important}.mb-2{margin-bottom:8px !important}.mb-n2{margin-bottom:-8px !important}.pa-2{padding:8px !important}.pa-n2{padding:-8px !important}.pl-2{padding-left:8px !important}.pl-n2{padding-left:-8px !important}.pr-2{padding-right:8px !important}.pr-n2{padding-right:-8px !important}.pt-2{padding-top:8px !important}.pt-n2{padding-top:-8px !important}.pb-2{padding-bottom:8px !important}.pb-n2{padding-bottom:-8px !important}.ma-3{margin:12px !important}.ma-n3{margin:-12px !important}.ml-3{margin-left:12px !important}.ml-n3{margin-left:-12px !important}.mr-3{margin-right:12px !important}.mr-n3{margin-right:-12px !important}.mt-3{margin-top:12px !important}.mt-n3{margin-top:-12px !important}.mb-3{margin-bottom:12px !important}.mb-n3{margin-bottom:-12px !important}.pa-3{padding:12px !important}.pa-n3{padding:-12px !important}.pl-3{padding-left:12px !important}.pl-n3{padding-left:-12px !important}.pr-3{padding-right:12px !important}.pr-n3{padding-right:-12px !important}.pt-3{padding-top:12px !important}.pt-n3{padding-top:-12px !important}.pb-3{padding-bottom:12px !important}.pb-n3{padding-bottom:-12px !important}.ma-4{margin:16px !important}.ma-n4{margin:-16px !important}.ml-4{margin-left:16px !important}.ml-n4{margin-left:-16px !important}.mr-4{margin-right:16px !important}.mr-n4{margin-right:-16px !important}.mt-4{margin-top:16px !important}.mt-n4{margin-top:-16px !important}.mb-4{margin-bottom:16px !important}.mb-n4{margin-bottom:-16px !important}.pa-4{padding:16px !important}.pa-n4{padding:-16px !important}.pl-4{padding-left:16px !important}.pl-n4{padding-left:-16px !important}.pr-4{padding-right:16px !important}.pr-n4{padding-right:-16px !important}.pt-4{padding-top:16px !important}.pt-n4{padding-top:-16px !important}.pb-4{padding-bottom:16px !important}.pb-n4{padding-bottom:-16px !important}.ma-5{margin:20px !important}.ma-n5{margin:-20px !important}.ml-5{margin-left:20px !important}.ml-n5{margin-left:-20px !important}.mr-5{margin-right:20px !important}.mr-n5{margin-right:-20px !important}.mt-5{margin-top:20px !important}.mt-n5{margin-top:-20px !important}.mb-5{margin-bottom:20px !important}.mb-n5{margin-bottom:-20px !important}.pa-5{padding:20px !important}.pa-n5{padding:-20px !important}.pl-5{padding-left:20px !important}.pl-n5{padding-left:-20px !important}.pr-5{padding-right:20px !important}.pr-n5{padding-right:-20px !important}.pt-5{padding-top:20px !important}.pt-n5{padding-top:-20px !important}.pb-5{padding-bottom:20px !important}.pb-n5{padding-bottom:-20px !important}.ma-6{margin:24px !important}.ma-n6{margin:-24px !important}.ml-6{margin-left:24px !important}.ml-n6{margin-left:-24px !important}.mr-6{margin-right:24px !important}.mr-n6{margin-right:-24px !important}.mt-6{margin-top:24px !important}.mt-n6{margin-top:-24px !important}.mb-6{margin-bottom:24px !important}.mb-n6{margin-bottom:-24px !important}.pa-6{padding:24px !important}.pa-n6{padding:-24px !important}.pl-6{padding-left:24px !important}.pl-n6{padding-left:-24px !important}.pr-6{padding-right:24px !important}.pr-n6{padding-right:-24px !important}.pt-6{padding-top:24px !important}.pt-n6{padding-top:-24px !important}.pb-6{padding-bottom:24px !important}.pb-n6{padding-bottom:-24px !important}.ma-7{margin:28px !important}.ma-n7{margin:-28px !important}.ml-7{margin-left:28px !important}.ml-n7{margin-left:-28px !important}.mr-7{margin-right:28px !important}.mr-n7{margin-right:-28px !important}.mt-7{margin-top:28px !important}.mt-n7{margin-top:-28px !important}.mb-7{margin-bottom:28px !important}.mb-n7{margin-bottom:-28px !important}.pa-7{padding:28px !important}.pa-n7{padding:-28px !important}.pl-7{padding-left:28px !important}.pl-n7{padding-left:-28px !important}.pr-7{padding-right:28px !important}.pr-n7{padding-right:-28px !important}.pt-7{padding-top:28px !important}.pt-n7{padding-top:-28px !important}.pb-7{padding-bottom:28px !important}.pb-n7{padding-bottom:-28px !important}.ma-8{margin:32px !important}.ma-n8{margin:-32px !important}.ml-8{margin-left:32px !important}.ml-n8{margin-left:-32px !important}.mr-8{margin-right:32px !important}.mr-n8{margin-right:-32px !important}.mt-8{margin-top:32px !important}.mt-n8{margin-top:-32px !important}.mb-8{margin-bottom:32px !important}.mb-n8{margin-bottom:-32px !important}.pa-8{padding:32px !important}.pa-n8{padding:-32px !important}.pl-8{padding-left:32px !important}.pl-n8{padding-left:-32px !important}.pr-8{padding-right:32px !important}.pr-n8{padding-right:-32px !important}.pt-8{padding-top:32px !important}.pt-n8{padding-top:-32px !important}.pb-8{padding-bottom:32px !important}.pb-n8{padding-bottom:-32px !important}.ma-9{margin:36px !important}.ma-n9{margin:-36px !important}.ml-9{margin-left:36px !important}.ml-n9{margin-left:-36px !important}.mr-9{margin-right:36px !important}.mr-n9{margin-right:-36px !important}.mt-9{margin-top:36px !important}.mt-n9{margin-top:-36px !important}.mb-9{margin-bottom:36px !important}.mb-n9{margin-bottom:-36px !important}.pa-9{padding:36px !important}.pa-n9{padding:-36px !important}.pl-9{padding-left:36px !important}.pl-n9{padding-left:-36px !important}.pr-9{padding-right:36px !important}.pr-n9{padding-right:-36px !important}.pt-9{padding-top:36px !important}.pt-n9{padding-top:-36px !important}.pb-9{padding-bottom:36px !important}.pb-n9{padding-bottom:-36px !important}.ma-10{margin:40px !important}.ma-n10{margin:-40px !important}.ml-10{margin-left:40px !important}.ml-n10{margin-left:-40px !important}.mr-10{margin-right:40px !important}.mr-n10{margin-right:-40px !important}.mt-10{margin-top:40px !important}.mt-n10{margin-top:-40px !important}.mb-10{margin-bottom:40px !important}.mb-n10{margin-bottom:-40px !important}.pa-10{padding:40px !important}.pa-n10{padding:-40px !important}.pl-10{padding-left:40px !important}.pl-n10{padding-left:-40px !important}.pr-10{padding-right:40px !important}.pr-n10{padding-right:-40px !important}.pt-10{padding-top:40px !important}.pt-n10{padding-top:-40px !important}.pb-10{padding-bottom:40px !important}.pb-n10{padding-bottom:-40px !important}.ma-11{margin:44px !important}.ma-n11{margin:-44px !important}.ml-11{margin-left:44px !important}.ml-n11{margin-left:-44px !important}.mr-11{margin-right:44px !important}.mr-n11{margin-right:-44px !important}.mt-11{margin-top:44px !important}.mt-n11{margin-top:-44px !important}.mb-11{margin-bottom:44px !important}.mb-n11{margin-bottom:-44px !important}.pa-11{padding:44px !important}.pa-n11{padding:-44px !important}.pl-11{padding-left:44px !important}.pl-n11{padding-left:-44px !important}.pr-11{padding-right:44px !important}.pr-n11{padding-right:-44px !important}.pt-11{padding-top:44px !important}.pt-n11{padding-top:-44px !important}.pb-11{padding-bottom:44px !important}.pb-n11{padding-bottom:-44px !important}.ma-12{margin:48px !important}.ma-n12{margin:-48px !important}.ml-12{margin-left:48px !important}.ml-n12{margin-left:-48px !important}.mr-12{margin-right:48px !important}.mr-n12{margin-right:-48px !important}.mt-12{margin-top:48px !important}.mt-n12{margin-top:-48px !important}.mb-12{margin-bottom:48px !important}.mb-n12{margin-bottom:-48px !important}.pa-12{padding:48px !important}.pa-n12{padding:-48px !important}.pl-12{padding-left:48px !important}.pl-n12{padding-left:-48px !important}.pr-12{padding-right:48px !important}.pr-n12{padding-right:-48px !important}.pt-12{padding-top:48px !important}.pt-n12{padding-top:-48px !important}.pb-12{padding-bottom:48px !important}.pb-n12{padding-bottom:-48px !important}.ma-13{margin:52px !important}.ma-n13{margin:-52px !important}.ml-13{margin-left:52px !important}.ml-n13{margin-left:-52px !important}.mr-13{margin-right:52px !important}.mr-n13{margin-right:-52px !important}.mt-13{margin-top:52px !important}.mt-n13{margin-top:-52px !important}.mb-13{margin-bottom:52px !important}.mb-n13{margin-bottom:-52px !important}.pa-13{padding:52px !important}.pa-n13{padding:-52px !important}.pl-13{padding-left:52px !important}.pl-n13{padding-left:-52px !important}.pr-13{padding-right:52px !important}.pr-n13{padding-right:-52px !important}.pt-13{padding-top:52px !important}.pt-n13{padding-top:-52px !important}.pb-13{padding-bottom:52px !important}.pb-n13{padding-bottom:-52px !important}.ma-14{margin:56px !important}.ma-n14{margin:-56px !important}.ml-14{margin-left:56px !important}.ml-n14{margin-left:-56px !important}.mr-14{margin-right:56px !important}.mr-n14{margin-right:-56px !important}.mt-14{margin-top:56px !important}.mt-n14{margin-top:-56px !important}.mb-14{margin-bottom:56px !important}.mb-n14{margin-bottom:-56px !important}.pa-14{padding:56px !important}.pa-n14{padding:-56px !important}.pl-14{padding-left:56px !important}.pl-n14{padding-left:-56px !important}.pr-14{padding-right:56px !important}.pr-n14{padding-right:-56px !important}.pt-14{padding-top:56px !important}.pt-n14{padding-top:-56px !important}.pb-14{padding-bottom:56px !important}.pb-n14{padding-bottom:-56px !important}.ma-15{margin:60px !important}.ma-n15{margin:-60px !important}.ml-15{margin-left:60px !important}.ml-n15{margin-left:-60px !important}.mr-15{margin-right:60px !important}.mr-n15{margin-right:-60px !important}.mt-15{margin-top:60px !important}.mt-n15{margin-top:-60px !important}.mb-15{margin-bottom:60px !important}.mb-n15{margin-bottom:-60px !important}.pa-15{padding:60px !important}.pa-n15{padding:-60px !important}.pl-15{padding-left:60px !important}.pl-n15{padding-left:-60px !important}.pr-15{padding-right:60px !important}.pr-n15{padding-right:-60px !important}.pt-15{padding-top:60px !important}.pt-n15{padding-top:-60px !important}.pb-15{padding-bottom:60px !important}.pb-n15{padding-bottom:-60px !important}.ma-16{margin:64px !important}.ma-n16{margin:-64px !important}.ml-16{margin-left:64px !important}.ml-n16{margin-left:-64px !important}.mr-16{margin-right:64px !important}.mr-n16{margin-right:-64px !important}.mt-16{margin-top:64px !important}.mt-n16{margin-top:-64px !important}.mb-16{margin-bottom:64px !important}.mb-n16{margin-bottom:-64px !important}.pa-16{padding:64px !important}.pa-n16{padding:-64px !important}.pl-16{padding-left:64px !important}.pl-n16{padding-left:-64px !important}.pr-16{padding-right:64px !important}.pr-n16{padding-right:-64px !important}.pt-16{padding-top:64px !important}.pt-n16{padding-top:-64px !important}.pb-16{padding-bottom:64px !important}.pb-n16{padding-bottom:-64px !important}@media only screen and (min-width: 600px){.ma-sm-0,.ma-sm-n0{margin:0 !important}}@media only screen and (min-width: 960px){.ma-md-0,.ma-md-n0{margin:0 !important}}@media only screen and (min-width: 1264px){.ma-lg-0,.ma-lg-n0{margin:0 !important}}@media only screen and (min-width: 1904px){.ma-xl-0,.ma-xl-n0{margin:0 !important}}@media only screen and (min-width: 600px){.ml-sm-0,.ml-sm-n0{margin-left:0 !important}}@media only screen and (min-width: 960px){.ml-md-0,.ml-md-n0{margin-left:0 !important}}@media only screen and (min-width: 1264px){.ml-lg-0,.ml-lg-n0{margin-left:0 !important}}@media only screen and (min-width: 1904px){.ml-xl-0,.ml-xl-n0{margin-left:0 !important}}@media only screen and (min-width: 600px){.mr-sm-0,.mr-sm-n0{margin-right:0 !important}}@media only screen and (min-width: 960px){.mr-md-0,.mr-md-n0{margin-right:0 !important}}@media only screen and (min-width: 1264px){.mr-lg-0,.mr-lg-n0{margin-right:0 !important}}@media only screen and (min-width: 1904px){.mr-xl-0,.mr-xl-n0{margin-right:0 !important}}@media only screen and (min-width: 600px){.mt-sm-0,.mt-sm-n0{margin-top:0 !important}}@media only screen and (min-width: 960px){.mt-md-0,.mt-md-n0{margin-top:0 !important}}@media only screen and (min-width: 1264px){.mt-lg-0,.mt-lg-n0{margin-top:0 !important}}@media only screen and (min-width: 1904px){.mt-xl-0,.mt-xl-n0{margin-top:0 !important}}@media only screen and (min-width: 600px){.mb-sm-0,.mb-sm-n0{margin-bottom:0 !important}}@media only screen and (min-width: 960px){.mb-md-0,.mb-md-n0{margin-bottom:0 !important}}@media only screen and (min-width: 1264px){.mb-lg-0,.mb-lg-n0{margin-bottom:0 !important}}@media only screen and (min-width: 1904px){.mb-xl-0,.mb-xl-n0{margin-bottom:0 !important}}@media only screen and (min-width: 600px){.pa-sm-0,.pa-sm-n0{padding:0 !important}}@media only screen and (min-width: 960px){.pa-md-0,.pa-md-n0{padding:0 !important}}@media only screen and (min-width: 1264px){.pa-lg-0,.pa-lg-n0{padding:0 !important}}@media only screen and (min-width: 1904px){.pa-xl-0,.pa-xl-n0{padding:0 !important}}@media only screen and (min-width: 600px){.pl-sm-0,.pl-sm-n0{padding-left:0 !important}}@media only screen and (min-width: 960px){.pl-md-0,.pl-md-n0{padding-left:0 !important}}@media only screen and (min-width: 1264px){.pl-lg-0,.pl-lg-n0{padding-left:0 !important}}@media only screen and (min-width: 1904px){.pl-xl-0,.pl-xl-n0{padding-left:0 !important}}@media only screen and (min-width: 600px){.pr-sm-0,.pr-sm-n0{padding-right:0 !important}}@media only screen and (min-width: 960px){.pr-md-0,.pr-md-n0{padding-right:0 !important}}@media only screen and (min-width: 1264px){.pr-lg-0,.pr-lg-n0{padding-right:0 !important}}@media only screen and (min-width: 1904px){.pr-xl-0,.pr-xl-n0{padding-right:0 !important}}@media only screen and (min-width: 600px){.pt-sm-0,.pt-sm-n0{padding-top:0 !important}}@media only screen and (min-width: 960px){.pt-md-0,.pt-md-n0{padding-top:0 !important}}@media only screen and (min-width: 1264px){.pt-lg-0,.pt-lg-n0{padding-top:0 !important}}@media only screen and (min-width: 1904px){.pt-xl-0,.pt-xl-n0{padding-top:0 !important}}@media only screen and (min-width: 600px){.pb-sm-0,.pb-sm-n0{padding-bottom:0 !important}}@media only screen and (min-width: 960px){.pb-md-0,.pb-md-n0{padding-bottom:0 !important}}@media only screen and (min-width: 1264px){.pb-lg-0,.pb-lg-n0{padding-bottom:0 !important}}@media only screen and (min-width: 1904px){.pb-xl-0,.pb-xl-n0{padding-bottom:0 !important}}@media only screen and (min-width: 600px){.ma-sm-1{margin:4px !important}.ma-sm-n1{margin:-4px !important}}@media only screen and (min-width: 960px){.ma-md-1{margin:4px !important}.ma-md-n1{margin:-4px !important}}@media only screen and (min-width: 1264px){.ma-lg-1{margin:4px !important}.ma-lg-n1{margin:-4px !important}}@media only screen and (min-width: 1904px){.ma-xl-1{margin:4px !important}.ma-xl-n1{margin:-4px !important}}@media only screen and (min-width: 600px){.ml-sm-1{margin-left:4px !important}.ml-sm-n1{margin-left:-4px !important}}@media only screen and (min-width: 960px){.ml-md-1{margin-left:4px !important}.ml-md-n1{margin-left:-4px !important}}@media only screen and (min-width: 1264px){.ml-lg-1{margin-left:4px !important}.ml-lg-n1{margin-left:-4px !important}}@media only screen and (min-width: 1904px){.ml-xl-1{margin-left:4px !important}.ml-xl-n1{margin-left:-4px !important}}@media only screen and (min-width: 600px){.mr-sm-1{margin-right:4px !important}.mr-sm-n1{margin-right:-4px !important}}@media only screen and (min-width: 960px){.mr-md-1{margin-right:4px !important}.mr-md-n1{margin-right:-4px !important}}@media only screen and (min-width: 1264px){.mr-lg-1{margin-right:4px !important}.mr-lg-n1{margin-right:-4px !important}}@media only screen and (min-width: 1904px){.mr-xl-1{margin-right:4px !important}.mr-xl-n1{margin-right:-4px !important}}@media only screen and (min-width: 600px){.mt-sm-1{margin-top:4px !important}.mt-sm-n1{margin-top:-4px !important}}@media only screen and (min-width: 960px){.mt-md-1{margin-top:4px !important}.mt-md-n1{margin-top:-4px !important}}@media only screen and (min-width: 1264px){.mt-lg-1{margin-top:4px !important}.mt-lg-n1{margin-top:-4px !important}}@media only screen and (min-width: 1904px){.mt-xl-1{margin-top:4px !important}.mt-xl-n1{margin-top:-4px !important}}@media only screen and (min-width: 600px){.mb-sm-1{margin-bottom:4px !important}.mb-sm-n1{margin-bottom:-4px !important}}@media only screen and (min-width: 960px){.mb-md-1{margin-bottom:4px !important}.mb-md-n1{margin-bottom:-4px !important}}@media only screen and (min-width: 1264px){.mb-lg-1{margin-bottom:4px !important}.mb-lg-n1{margin-bottom:-4px !important}}@media only screen and (min-width: 1904px){.mb-xl-1{margin-bottom:4px !important}.mb-xl-n1{margin-bottom:-4px !important}}@media only screen and (min-width: 600px){.pa-sm-1{padding:4px !important}.pa-sm-n1{padding:-4px !important}}@media only screen and (min-width: 960px){.pa-md-1{padding:4px !important}.pa-md-n1{padding:-4px !important}}@media only screen and (min-width: 1264px){.pa-lg-1{padding:4px !important}.pa-lg-n1{padding:-4px !important}}@media only screen and (min-width: 1904px){.pa-xl-1{padding:4px !important}.pa-xl-n1{padding:-4px !important}}@media only screen and (min-width: 600px){.pl-sm-1{padding-left:4px !important}.pl-sm-n1{padding-left:-4px !important}}@media only screen and (min-width: 960px){.pl-md-1{padding-left:4px !important}.pl-md-n1{padding-left:-4px !important}}@media only screen and (min-width: 1264px){.pl-lg-1{padding-left:4px !important}.pl-lg-n1{padding-left:-4px !important}}@media only screen and (min-width: 1904px){.pl-xl-1{padding-left:4px !important}.pl-xl-n1{padding-left:-4px !important}}@media only screen and (min-width: 600px){.pr-sm-1{padding-right:4px !important}.pr-sm-n1{padding-right:-4px !important}}@media only screen and (min-width: 960px){.pr-md-1{padding-right:4px !important}.pr-md-n1{padding-right:-4px !important}}@media only screen and (min-width: 1264px){.pr-lg-1{padding-right:4px !important}.pr-lg-n1{padding-right:-4px !important}}@media only screen and (min-width: 1904px){.pr-xl-1{padding-right:4px !important}.pr-xl-n1{padding-right:-4px !important}}@media only screen and (min-width: 600px){.pt-sm-1{padding-top:4px !important}.pt-sm-n1{padding-top:-4px !important}}@media only screen and (min-width: 960px){.pt-md-1{padding-top:4px !important}.pt-md-n1{padding-top:-4px !important}}@media only screen and (min-width: 1264px){.pt-lg-1{padding-top:4px !important}.pt-lg-n1{padding-top:-4px !important}}@media only screen and (min-width: 1904px){.pt-xl-1{padding-top:4px !important}.pt-xl-n1{padding-top:-4px !important}}@media only screen and (min-width: 600px){.pb-sm-1{padding-bottom:4px !important}.pb-sm-n1{padding-bottom:-4px !important}}@media only screen and (min-width: 960px){.pb-md-1{padding-bottom:4px !important}.pb-md-n1{padding-bottom:-4px !important}}@media only screen and (min-width: 1264px){.pb-lg-1{padding-bottom:4px !important}.pb-lg-n1{padding-bottom:-4px !important}}@media only screen and (min-width: 1904px){.pb-xl-1{padding-bottom:4px !important}.pb-xl-n1{padding-bottom:-4px !important}}@media only screen and (min-width: 600px){.ma-sm-2{margin:8px !important}.ma-sm-n2{margin:-8px !important}}@media only screen and (min-width: 960px){.ma-md-2{margin:8px !important}.ma-md-n2{margin:-8px !important}}@media only screen and (min-width: 1264px){.ma-lg-2{margin:8px !important}.ma-lg-n2{margin:-8px !important}}@media only screen and (min-width: 1904px){.ma-xl-2{margin:8px !important}.ma-xl-n2{margin:-8px !important}}@media only screen and (min-width: 600px){.ml-sm-2{margin-left:8px !important}.ml-sm-n2{margin-left:-8px !important}}@media only screen and (min-width: 960px){.ml-md-2{margin-left:8px !important}.ml-md-n2{margin-left:-8px !important}}@media only screen and (min-width: 1264px){.ml-lg-2{margin-left:8px !important}.ml-lg-n2{margin-left:-8px !important}}@media only screen and (min-width: 1904px){.ml-xl-2{margin-left:8px !important}.ml-xl-n2{margin-left:-8px !important}}@media only screen and (min-width: 600px){.mr-sm-2{margin-right:8px !important}.mr-sm-n2{margin-right:-8px !important}}@media only screen and (min-width: 960px){.mr-md-2{margin-right:8px !important}.mr-md-n2{margin-right:-8px !important}}@media only screen and (min-width: 1264px){.mr-lg-2{margin-right:8px !important}.mr-lg-n2{margin-right:-8px !important}}@media only screen and (min-width: 1904px){.mr-xl-2{margin-right:8px !important}.mr-xl-n2{margin-right:-8px !important}}@media only screen and (min-width: 600px){.mt-sm-2{margin-top:8px !important}.mt-sm-n2{margin-top:-8px !important}}@media only screen and (min-width: 960px){.mt-md-2{margin-top:8px !important}.mt-md-n2{margin-top:-8px !important}}@media only screen and (min-width: 1264px){.mt-lg-2{margin-top:8px !important}.mt-lg-n2{margin-top:-8px !important}}@media only screen and (min-width: 1904px){.mt-xl-2{margin-top:8px !important}.mt-xl-n2{margin-top:-8px !important}}@media only screen and (min-width: 600px){.mb-sm-2{margin-bottom:8px !important}.mb-sm-n2{margin-bottom:-8px !important}}@media only screen and (min-width: 960px){.mb-md-2{margin-bottom:8px !important}.mb-md-n2{margin-bottom:-8px !important}}@media only screen and (min-width: 1264px){.mb-lg-2{margin-bottom:8px !important}.mb-lg-n2{margin-bottom:-8px !important}}@media only screen and (min-width: 1904px){.mb-xl-2{margin-bottom:8px !important}.mb-xl-n2{margin-bottom:-8px !important}}@media only screen and (min-width: 600px){.pa-sm-2{padding:8px !important}.pa-sm-n2{padding:-8px !important}}@media only screen and (min-width: 960px){.pa-md-2{padding:8px !important}.pa-md-n2{padding:-8px !important}}@media only screen and (min-width: 1264px){.pa-lg-2{padding:8px !important}.pa-lg-n2{padding:-8px !important}}@media only screen and (min-width: 1904px){.pa-xl-2{padding:8px !important}.pa-xl-n2{padding:-8px !important}}@media only screen and (min-width: 600px){.pl-sm-2{padding-left:8px !important}.pl-sm-n2{padding-left:-8px !important}}@media only screen and (min-width: 960px){.pl-md-2{padding-left:8px !important}.pl-md-n2{padding-left:-8px !important}}@media only screen and (min-width: 1264px){.pl-lg-2{padding-left:8px !important}.pl-lg-n2{padding-left:-8px !important}}@media only screen and (min-width: 1904px){.pl-xl-2{padding-left:8px !important}.pl-xl-n2{padding-left:-8px !important}}@media only screen and (min-width: 600px){.pr-sm-2{padding-right:8px !important}.pr-sm-n2{padding-right:-8px !important}}@media only screen and (min-width: 960px){.pr-md-2{padding-right:8px !important}.pr-md-n2{padding-right:-8px !important}}@media only screen and (min-width: 1264px){.pr-lg-2{padding-right:8px !important}.pr-lg-n2{padding-right:-8px !important}}@media only screen and (min-width: 1904px){.pr-xl-2{padding-right:8px !important}.pr-xl-n2{padding-right:-8px !important}}@media only screen and (min-width: 600px){.pt-sm-2{padding-top:8px !important}.pt-sm-n2{padding-top:-8px !important}}@media only screen and (min-width: 960px){.pt-md-2{padding-top:8px !important}.pt-md-n2{padding-top:-8px !important}}@media only screen and (min-width: 1264px){.pt-lg-2{padding-top:8px !important}.pt-lg-n2{padding-top:-8px !important}}@media only screen and (min-width: 1904px){.pt-xl-2{padding-top:8px !important}.pt-xl-n2{padding-top:-8px !important}}@media only screen and (min-width: 600px){.pb-sm-2{padding-bottom:8px !important}.pb-sm-n2{padding-bottom:-8px !important}}@media only screen and (min-width: 960px){.pb-md-2{padding-bottom:8px !important}.pb-md-n2{padding-bottom:-8px !important}}@media only screen and (min-width: 1264px){.pb-lg-2{padding-bottom:8px !important}.pb-lg-n2{padding-bottom:-8px !important}}@media only screen and (min-width: 1904px){.pb-xl-2{padding-bottom:8px !important}.pb-xl-n2{padding-bottom:-8px !important}}@media only screen and (min-width: 600px){.ma-sm-3{margin:12px !important}.ma-sm-n3{margin:-12px !important}}@media only screen and (min-width: 960px){.ma-md-3{margin:12px !important}.ma-md-n3{margin:-12px !important}}@media only screen and (min-width: 1264px){.ma-lg-3{margin:12px !important}.ma-lg-n3{margin:-12px !important}}@media only screen and (min-width: 1904px){.ma-xl-3{margin:12px !important}.ma-xl-n3{margin:-12px !important}}@media only screen and (min-width: 600px){.ml-sm-3{margin-left:12px !important}.ml-sm-n3{margin-left:-12px !important}}@media only screen and (min-width: 960px){.ml-md-3{margin-left:12px !important}.ml-md-n3{margin-left:-12px !important}}@media only screen and (min-width: 1264px){.ml-lg-3{margin-left:12px !important}.ml-lg-n3{margin-left:-12px !important}}@media only screen and (min-width: 1904px){.ml-xl-3{margin-left:12px !important}.ml-xl-n3{margin-left:-12px !important}}@media only screen and (min-width: 600px){.mr-sm-3{margin-right:12px !important}.mr-sm-n3{margin-right:-12px !important}}@media only screen and (min-width: 960px){.mr-md-3{margin-right:12px !important}.mr-md-n3{margin-right:-12px !important}}@media only screen and (min-width: 1264px){.mr-lg-3{margin-right:12px !important}.mr-lg-n3{margin-right:-12px !important}}@media only screen and (min-width: 1904px){.mr-xl-3{margin-right:12px !important}.mr-xl-n3{margin-right:-12px !important}}@media only screen and (min-width: 600px){.mt-sm-3{margin-top:12px !important}.mt-sm-n3{margin-top:-12px !important}}@media only screen and (min-width: 960px){.mt-md-3{margin-top:12px !important}.mt-md-n3{margin-top:-12px !important}}@media only screen and (min-width: 1264px){.mt-lg-3{margin-top:12px !important}.mt-lg-n3{margin-top:-12px !important}}@media only screen and (min-width: 1904px){.mt-xl-3{margin-top:12px !important}.mt-xl-n3{margin-top:-12px !important}}@media only screen and (min-width: 600px){.mb-sm-3{margin-bottom:12px !important}.mb-sm-n3{margin-bottom:-12px !important}}@media only screen and (min-width: 960px){.mb-md-3{margin-bottom:12px !important}.mb-md-n3{margin-bottom:-12px !important}}@media only screen and (min-width: 1264px){.mb-lg-3{margin-bottom:12px !important}.mb-lg-n3{margin-bottom:-12px !important}}@media only screen and (min-width: 1904px){.mb-xl-3{margin-bottom:12px !important}.mb-xl-n3{margin-bottom:-12px !important}}@media only screen and (min-width: 600px){.pa-sm-3{padding:12px !important}.pa-sm-n3{padding:-12px !important}}@media only screen and (min-width: 960px){.pa-md-3{padding:12px !important}.pa-md-n3{padding:-12px !important}}@media only screen and (min-width: 1264px){.pa-lg-3{padding:12px !important}.pa-lg-n3{padding:-12px !important}}@media only screen and (min-width: 1904px){.pa-xl-3{padding:12px !important}.pa-xl-n3{padding:-12px !important}}@media only screen and (min-width: 600px){.pl-sm-3{padding-left:12px !important}.pl-sm-n3{padding-left:-12px !important}}@media only screen and (min-width: 960px){.pl-md-3{padding-left:12px !important}.pl-md-n3{padding-left:-12px !important}}@media only screen and (min-width: 1264px){.pl-lg-3{padding-left:12px !important}.pl-lg-n3{padding-left:-12px !important}}@media only screen and (min-width: 1904px){.pl-xl-3{padding-left:12px !important}.pl-xl-n3{padding-left:-12px !important}}@media only screen and (min-width: 600px){.pr-sm-3{padding-right:12px !important}.pr-sm-n3{padding-right:-12px !important}}@media only screen and (min-width: 960px){.pr-md-3{padding-right:12px !important}.pr-md-n3{padding-right:-12px !important}}@media only screen and (min-width: 1264px){.pr-lg-3{padding-right:12px !important}.pr-lg-n3{padding-right:-12px !important}}@media only screen and (min-width: 1904px){.pr-xl-3{padding-right:12px !important}.pr-xl-n3{padding-right:-12px !important}}@media only screen and (min-width: 600px){.pt-sm-3{padding-top:12px !important}.pt-sm-n3{padding-top:-12px !important}}@media only screen and (min-width: 960px){.pt-md-3{padding-top:12px !important}.pt-md-n3{padding-top:-12px !important}}@media only screen and (min-width: 1264px){.pt-lg-3{padding-top:12px !important}.pt-lg-n3{padding-top:-12px !important}}@media only screen and (min-width: 1904px){.pt-xl-3{padding-top:12px !important}.pt-xl-n3{padding-top:-12px !important}}@media only screen and (min-width: 600px){.pb-sm-3{padding-bottom:12px !important}.pb-sm-n3{padding-bottom:-12px !important}}@media only screen and (min-width: 960px){.pb-md-3{padding-bottom:12px !important}.pb-md-n3{padding-bottom:-12px !important}}@media only screen and (min-width: 1264px){.pb-lg-3{padding-bottom:12px !important}.pb-lg-n3{padding-bottom:-12px !important}}@media only screen and (min-width: 1904px){.pb-xl-3{padding-bottom:12px !important}.pb-xl-n3{padding-bottom:-12px !important}}@media only screen and (min-width: 600px){.ma-sm-4{margin:16px !important}.ma-sm-n4{margin:-16px !important}}@media only screen and (min-width: 960px){.ma-md-4{margin:16px !important}.ma-md-n4{margin:-16px !important}}@media only screen and (min-width: 1264px){.ma-lg-4{margin:16px !important}.ma-lg-n4{margin:-16px !important}}@media only screen and (min-width: 1904px){.ma-xl-4{margin:16px !important}.ma-xl-n4{margin:-16px !important}}@media only screen and (min-width: 600px){.ml-sm-4{margin-left:16px !important}.ml-sm-n4{margin-left:-16px !important}}@media only screen and (min-width: 960px){.ml-md-4{margin-left:16px !important}.ml-md-n4{margin-left:-16px !important}}@media only screen and (min-width: 1264px){.ml-lg-4{margin-left:16px !important}.ml-lg-n4{margin-left:-16px !important}}@media only screen and (min-width: 1904px){.ml-xl-4{margin-left:16px !important}.ml-xl-n4{margin-left:-16px !important}}@media only screen and (min-width: 600px){.mr-sm-4{margin-right:16px !important}.mr-sm-n4{margin-right:-16px !important}}@media only screen and (min-width: 960px){.mr-md-4{margin-right:16px !important}.mr-md-n4{margin-right:-16px !important}}@media only screen and (min-width: 1264px){.mr-lg-4{margin-right:16px !important}.mr-lg-n4{margin-right:-16px !important}}@media only screen and (min-width: 1904px){.mr-xl-4{margin-right:16px !important}.mr-xl-n4{margin-right:-16px !important}}@media only screen and (min-width: 600px){.mt-sm-4{margin-top:16px !important}.mt-sm-n4{margin-top:-16px !important}}@media only screen and (min-width: 960px){.mt-md-4{margin-top:16px !important}.mt-md-n4{margin-top:-16px !important}}@media only screen and (min-width: 1264px){.mt-lg-4{margin-top:16px !important}.mt-lg-n4{margin-top:-16px !important}}@media only screen and (min-width: 1904px){.mt-xl-4{margin-top:16px !important}.mt-xl-n4{margin-top:-16px !important}}@media only screen and (min-width: 600px){.mb-sm-4{margin-bottom:16px !important}.mb-sm-n4{margin-bottom:-16px !important}}@media only screen and (min-width: 960px){.mb-md-4{margin-bottom:16px !important}.mb-md-n4{margin-bottom:-16px !important}}@media only screen and (min-width: 1264px){.mb-lg-4{margin-bottom:16px !important}.mb-lg-n4{margin-bottom:-16px !important}}@media only screen and (min-width: 1904px){.mb-xl-4{margin-bottom:16px !important}.mb-xl-n4{margin-bottom:-16px !important}}@media only screen and (min-width: 600px){.pa-sm-4{padding:16px !important}.pa-sm-n4{padding:-16px !important}}@media only screen and (min-width: 960px){.pa-md-4{padding:16px !important}.pa-md-n4{padding:-16px !important}}@media only screen and (min-width: 1264px){.pa-lg-4{padding:16px !important}.pa-lg-n4{padding:-16px !important}}@media only screen and (min-width: 1904px){.pa-xl-4{padding:16px !important}.pa-xl-n4{padding:-16px !important}}@media only screen and (min-width: 600px){.pl-sm-4{padding-left:16px !important}.pl-sm-n4{padding-left:-16px !important}}@media only screen and (min-width: 960px){.pl-md-4{padding-left:16px !important}.pl-md-n4{padding-left:-16px !important}}@media only screen and (min-width: 1264px){.pl-lg-4{padding-left:16px !important}.pl-lg-n4{padding-left:-16px !important}}@media only screen and (min-width: 1904px){.pl-xl-4{padding-left:16px !important}.pl-xl-n4{padding-left:-16px !important}}@media only screen and (min-width: 600px){.pr-sm-4{padding-right:16px !important}.pr-sm-n4{padding-right:-16px !important}}@media only screen and (min-width: 960px){.pr-md-4{padding-right:16px !important}.pr-md-n4{padding-right:-16px !important}}@media only screen and (min-width: 1264px){.pr-lg-4{padding-right:16px !important}.pr-lg-n4{padding-right:-16px !important}}@media only screen and (min-width: 1904px){.pr-xl-4{padding-right:16px !important}.pr-xl-n4{padding-right:-16px !important}}@media only screen and (min-width: 600px){.pt-sm-4{padding-top:16px !important}.pt-sm-n4{padding-top:-16px !important}}@media only screen and (min-width: 960px){.pt-md-4{padding-top:16px !important}.pt-md-n4{padding-top:-16px !important}}@media only screen and (min-width: 1264px){.pt-lg-4{padding-top:16px !important}.pt-lg-n4{padding-top:-16px !important}}@media only screen and (min-width: 1904px){.pt-xl-4{padding-top:16px !important}.pt-xl-n4{padding-top:-16px !important}}@media only screen and (min-width: 600px){.pb-sm-4{padding-bottom:16px !important}.pb-sm-n4{padding-bottom:-16px !important}}@media only screen and (min-width: 960px){.pb-md-4{padding-bottom:16px !important}.pb-md-n4{padding-bottom:-16px !important}}@media only screen and (min-width: 1264px){.pb-lg-4{padding-bottom:16px !important}.pb-lg-n4{padding-bottom:-16px !important}}@media only screen and (min-width: 1904px){.pb-xl-4{padding-bottom:16px !important}.pb-xl-n4{padding-bottom:-16px !important}}@media only screen and (min-width: 600px){.ma-sm-5{margin:20px !important}.ma-sm-n5{margin:-20px !important}}@media only screen and (min-width: 960px){.ma-md-5{margin:20px !important}.ma-md-n5{margin:-20px !important}}@media only screen and (min-width: 1264px){.ma-lg-5{margin:20px !important}.ma-lg-n5{margin:-20px !important}}@media only screen and (min-width: 1904px){.ma-xl-5{margin:20px !important}.ma-xl-n5{margin:-20px !important}}@media only screen and (min-width: 600px){.ml-sm-5{margin-left:20px !important}.ml-sm-n5{margin-left:-20px !important}}@media only screen and (min-width: 960px){.ml-md-5{margin-left:20px !important}.ml-md-n5{margin-left:-20px !important}}@media only screen and (min-width: 1264px){.ml-lg-5{margin-left:20px !important}.ml-lg-n5{margin-left:-20px !important}}@media only screen and (min-width: 1904px){.ml-xl-5{margin-left:20px !important}.ml-xl-n5{margin-left:-20px !important}}@media only screen and (min-width: 600px){.mr-sm-5{margin-right:20px !important}.mr-sm-n5{margin-right:-20px !important}}@media only screen and (min-width: 960px){.mr-md-5{margin-right:20px !important}.mr-md-n5{margin-right:-20px !important}}@media only screen and (min-width: 1264px){.mr-lg-5{margin-right:20px !important}.mr-lg-n5{margin-right:-20px !important}}@media only screen and (min-width: 1904px){.mr-xl-5{margin-right:20px !important}.mr-xl-n5{margin-right:-20px !important}}@media only screen and (min-width: 600px){.mt-sm-5{margin-top:20px !important}.mt-sm-n5{margin-top:-20px !important}}@media only screen and (min-width: 960px){.mt-md-5{margin-top:20px !important}.mt-md-n5{margin-top:-20px !important}}@media only screen and (min-width: 1264px){.mt-lg-5{margin-top:20px !important}.mt-lg-n5{margin-top:-20px !important}}@media only screen and (min-width: 1904px){.mt-xl-5{margin-top:20px !important}.mt-xl-n5{margin-top:-20px !important}}@media only screen and (min-width: 600px){.mb-sm-5{margin-bottom:20px !important}.mb-sm-n5{margin-bottom:-20px !important}}@media only screen and (min-width: 960px){.mb-md-5{margin-bottom:20px !important}.mb-md-n5{margin-bottom:-20px !important}}@media only screen and (min-width: 1264px){.mb-lg-5{margin-bottom:20px !important}.mb-lg-n5{margin-bottom:-20px !important}}@media only screen and (min-width: 1904px){.mb-xl-5{margin-bottom:20px !important}.mb-xl-n5{margin-bottom:-20px !important}}@media only screen and (min-width: 600px){.pa-sm-5{padding:20px !important}.pa-sm-n5{padding:-20px !important}}@media only screen and (min-width: 960px){.pa-md-5{padding:20px !important}.pa-md-n5{padding:-20px !important}}@media only screen and (min-width: 1264px){.pa-lg-5{padding:20px !important}.pa-lg-n5{padding:-20px !important}}@media only screen and (min-width: 1904px){.pa-xl-5{padding:20px !important}.pa-xl-n5{padding:-20px !important}}@media only screen and (min-width: 600px){.pl-sm-5{padding-left:20px !important}.pl-sm-n5{padding-left:-20px !important}}@media only screen and (min-width: 960px){.pl-md-5{padding-left:20px !important}.pl-md-n5{padding-left:-20px !important}}@media only screen and (min-width: 1264px){.pl-lg-5{padding-left:20px !important}.pl-lg-n5{padding-left:-20px !important}}@media only screen and (min-width: 1904px){.pl-xl-5{padding-left:20px !important}.pl-xl-n5{padding-left:-20px !important}}@media only screen and (min-width: 600px){.pr-sm-5{padding-right:20px !important}.pr-sm-n5{padding-right:-20px !important}}@media only screen and (min-width: 960px){.pr-md-5{padding-right:20px !important}.pr-md-n5{padding-right:-20px !important}}@media only screen and (min-width: 1264px){.pr-lg-5{padding-right:20px !important}.pr-lg-n5{padding-right:-20px !important}}@media only screen and (min-width: 1904px){.pr-xl-5{padding-right:20px !important}.pr-xl-n5{padding-right:-20px !important}}@media only screen and (min-width: 600px){.pt-sm-5{padding-top:20px !important}.pt-sm-n5{padding-top:-20px !important}}@media only screen and (min-width: 960px){.pt-md-5{padding-top:20px !important}.pt-md-n5{padding-top:-20px !important}}@media only screen and (min-width: 1264px){.pt-lg-5{padding-top:20px !important}.pt-lg-n5{padding-top:-20px !important}}@media only screen and (min-width: 1904px){.pt-xl-5{padding-top:20px !important}.pt-xl-n5{padding-top:-20px !important}}@media only screen and (min-width: 600px){.pb-sm-5{padding-bottom:20px !important}.pb-sm-n5{padding-bottom:-20px !important}}@media only screen and (min-width: 960px){.pb-md-5{padding-bottom:20px !important}.pb-md-n5{padding-bottom:-20px !important}}@media only screen and (min-width: 1264px){.pb-lg-5{padding-bottom:20px !important}.pb-lg-n5{padding-bottom:-20px !important}}@media only screen and (min-width: 1904px){.pb-xl-5{padding-bottom:20px !important}.pb-xl-n5{padding-bottom:-20px !important}}@media only screen and (min-width: 600px){.ma-sm-6{margin:24px !important}.ma-sm-n6{margin:-24px !important}}@media only screen and (min-width: 960px){.ma-md-6{margin:24px !important}.ma-md-n6{margin:-24px !important}}@media only screen and (min-width: 1264px){.ma-lg-6{margin:24px !important}.ma-lg-n6{margin:-24px !important}}@media only screen and (min-width: 1904px){.ma-xl-6{margin:24px !important}.ma-xl-n6{margin:-24px !important}}@media only screen and (min-width: 600px){.ml-sm-6{margin-left:24px !important}.ml-sm-n6{margin-left:-24px !important}}@media only screen and (min-width: 960px){.ml-md-6{margin-left:24px !important}.ml-md-n6{margin-left:-24px !important}}@media only screen and (min-width: 1264px){.ml-lg-6{margin-left:24px !important}.ml-lg-n6{margin-left:-24px !important}}@media only screen and (min-width: 1904px){.ml-xl-6{margin-left:24px !important}.ml-xl-n6{margin-left:-24px !important}}@media only screen and (min-width: 600px){.mr-sm-6{margin-right:24px !important}.mr-sm-n6{margin-right:-24px !important}}@media only screen and (min-width: 960px){.mr-md-6{margin-right:24px !important}.mr-md-n6{margin-right:-24px !important}}@media only screen and (min-width: 1264px){.mr-lg-6{margin-right:24px !important}.mr-lg-n6{margin-right:-24px !important}}@media only screen and (min-width: 1904px){.mr-xl-6{margin-right:24px !important}.mr-xl-n6{margin-right:-24px !important}}@media only screen and (min-width: 600px){.mt-sm-6{margin-top:24px !important}.mt-sm-n6{margin-top:-24px !important}}@media only screen and (min-width: 960px){.mt-md-6{margin-top:24px !important}.mt-md-n6{margin-top:-24px !important}}@media only screen and (min-width: 1264px){.mt-lg-6{margin-top:24px !important}.mt-lg-n6{margin-top:-24px !important}}@media only screen and (min-width: 1904px){.mt-xl-6{margin-top:24px !important}.mt-xl-n6{margin-top:-24px !important}}@media only screen and (min-width: 600px){.mb-sm-6{margin-bottom:24px !important}.mb-sm-n6{margin-bottom:-24px !important}}@media only screen and (min-width: 960px){.mb-md-6{margin-bottom:24px !important}.mb-md-n6{margin-bottom:-24px !important}}@media only screen and (min-width: 1264px){.mb-lg-6{margin-bottom:24px !important}.mb-lg-n6{margin-bottom:-24px !important}}@media only screen and (min-width: 1904px){.mb-xl-6{margin-bottom:24px !important}.mb-xl-n6{margin-bottom:-24px !important}}@media only screen and (min-width: 600px){.pa-sm-6{padding:24px !important}.pa-sm-n6{padding:-24px !important}}@media only screen and (min-width: 960px){.pa-md-6{padding:24px !important}.pa-md-n6{padding:-24px !important}}@media only screen and (min-width: 1264px){.pa-lg-6{padding:24px !important}.pa-lg-n6{padding:-24px !important}}@media only screen and (min-width: 1904px){.pa-xl-6{padding:24px !important}.pa-xl-n6{padding:-24px !important}}@media only screen and (min-width: 600px){.pl-sm-6{padding-left:24px !important}.pl-sm-n6{padding-left:-24px !important}}@media only screen and (min-width: 960px){.pl-md-6{padding-left:24px !important}.pl-md-n6{padding-left:-24px !important}}@media only screen and (min-width: 1264px){.pl-lg-6{padding-left:24px !important}.pl-lg-n6{padding-left:-24px !important}}@media only screen and (min-width: 1904px){.pl-xl-6{padding-left:24px !important}.pl-xl-n6{padding-left:-24px !important}}@media only screen and (min-width: 600px){.pr-sm-6{padding-right:24px !important}.pr-sm-n6{padding-right:-24px !important}}@media only screen and (min-width: 960px){.pr-md-6{padding-right:24px !important}.pr-md-n6{padding-right:-24px !important}}@media only screen and (min-width: 1264px){.pr-lg-6{padding-right:24px !important}.pr-lg-n6{padding-right:-24px !important}}@media only screen and (min-width: 1904px){.pr-xl-6{padding-right:24px !important}.pr-xl-n6{padding-right:-24px !important}}@media only screen and (min-width: 600px){.pt-sm-6{padding-top:24px !important}.pt-sm-n6{padding-top:-24px !important}}@media only screen and (min-width: 960px){.pt-md-6{padding-top:24px !important}.pt-md-n6{padding-top:-24px !important}}@media only screen and (min-width: 1264px){.pt-lg-6{padding-top:24px !important}.pt-lg-n6{padding-top:-24px !important}}@media only screen and (min-width: 1904px){.pt-xl-6{padding-top:24px !important}.pt-xl-n6{padding-top:-24px !important}}@media only screen and (min-width: 600px){.pb-sm-6{padding-bottom:24px !important}.pb-sm-n6{padding-bottom:-24px !important}}@media only screen and (min-width: 960px){.pb-md-6{padding-bottom:24px !important}.pb-md-n6{padding-bottom:-24px !important}}@media only screen and (min-width: 1264px){.pb-lg-6{padding-bottom:24px !important}.pb-lg-n6{padding-bottom:-24px !important}}@media only screen and (min-width: 1904px){.pb-xl-6{padding-bottom:24px !important}.pb-xl-n6{padding-bottom:-24px !important}}@media only screen and (min-width: 600px){.ma-sm-7{margin:28px !important}.ma-sm-n7{margin:-28px !important}}@media only screen and (min-width: 960px){.ma-md-7{margin:28px !important}.ma-md-n7{margin:-28px !important}}@media only screen and (min-width: 1264px){.ma-lg-7{margin:28px !important}.ma-lg-n7{margin:-28px !important}}@media only screen and (min-width: 1904px){.ma-xl-7{margin:28px !important}.ma-xl-n7{margin:-28px !important}}@media only screen and (min-width: 600px){.ml-sm-7{margin-left:28px !important}.ml-sm-n7{margin-left:-28px !important}}@media only screen and (min-width: 960px){.ml-md-7{margin-left:28px !important}.ml-md-n7{margin-left:-28px !important}}@media only screen and (min-width: 1264px){.ml-lg-7{margin-left:28px !important}.ml-lg-n7{margin-left:-28px !important}}@media only screen and (min-width: 1904px){.ml-xl-7{margin-left:28px !important}.ml-xl-n7{margin-left:-28px !important}}@media only screen and (min-width: 600px){.mr-sm-7{margin-right:28px !important}.mr-sm-n7{margin-right:-28px !important}}@media only screen and (min-width: 960px){.mr-md-7{margin-right:28px !important}.mr-md-n7{margin-right:-28px !important}}@media only screen and (min-width: 1264px){.mr-lg-7{margin-right:28px !important}.mr-lg-n7{margin-right:-28px !important}}@media only screen and (min-width: 1904px){.mr-xl-7{margin-right:28px !important}.mr-xl-n7{margin-right:-28px !important}}@media only screen and (min-width: 600px){.mt-sm-7{margin-top:28px !important}.mt-sm-n7{margin-top:-28px !important}}@media only screen and (min-width: 960px){.mt-md-7{margin-top:28px !important}.mt-md-n7{margin-top:-28px !important}}@media only screen and (min-width: 1264px){.mt-lg-7{margin-top:28px !important}.mt-lg-n7{margin-top:-28px !important}}@media only screen and (min-width: 1904px){.mt-xl-7{margin-top:28px !important}.mt-xl-n7{margin-top:-28px !important}}@media only screen and (min-width: 600px){.mb-sm-7{margin-bottom:28px !important}.mb-sm-n7{margin-bottom:-28px !important}}@media only screen and (min-width: 960px){.mb-md-7{margin-bottom:28px !important}.mb-md-n7{margin-bottom:-28px !important}}@media only screen and (min-width: 1264px){.mb-lg-7{margin-bottom:28px !important}.mb-lg-n7{margin-bottom:-28px !important}}@media only screen and (min-width: 1904px){.mb-xl-7{margin-bottom:28px !important}.mb-xl-n7{margin-bottom:-28px !important}}@media only screen and (min-width: 600px){.pa-sm-7{padding:28px !important}.pa-sm-n7{padding:-28px !important}}@media only screen and (min-width: 960px){.pa-md-7{padding:28px !important}.pa-md-n7{padding:-28px !important}}@media only screen and (min-width: 1264px){.pa-lg-7{padding:28px !important}.pa-lg-n7{padding:-28px !important}}@media only screen and (min-width: 1904px){.pa-xl-7{padding:28px !important}.pa-xl-n7{padding:-28px !important}}@media only screen and (min-width: 600px){.pl-sm-7{padding-left:28px !important}.pl-sm-n7{padding-left:-28px !important}}@media only screen and (min-width: 960px){.pl-md-7{padding-left:28px !important}.pl-md-n7{padding-left:-28px !important}}@media only screen and (min-width: 1264px){.pl-lg-7{padding-left:28px !important}.pl-lg-n7{padding-left:-28px !important}}@media only screen and (min-width: 1904px){.pl-xl-7{padding-left:28px !important}.pl-xl-n7{padding-left:-28px !important}}@media only screen and (min-width: 600px){.pr-sm-7{padding-right:28px !important}.pr-sm-n7{padding-right:-28px !important}}@media only screen and (min-width: 960px){.pr-md-7{padding-right:28px !important}.pr-md-n7{padding-right:-28px !important}}@media only screen and (min-width: 1264px){.pr-lg-7{padding-right:28px !important}.pr-lg-n7{padding-right:-28px !important}}@media only screen and (min-width: 1904px){.pr-xl-7{padding-right:28px !important}.pr-xl-n7{padding-right:-28px !important}}@media only screen and (min-width: 600px){.pt-sm-7{padding-top:28px !important}.pt-sm-n7{padding-top:-28px !important}}@media only screen and (min-width: 960px){.pt-md-7{padding-top:28px !important}.pt-md-n7{padding-top:-28px !important}}@media only screen and (min-width: 1264px){.pt-lg-7{padding-top:28px !important}.pt-lg-n7{padding-top:-28px !important}}@media only screen and (min-width: 1904px){.pt-xl-7{padding-top:28px !important}.pt-xl-n7{padding-top:-28px !important}}@media only screen and (min-width: 600px){.pb-sm-7{padding-bottom:28px !important}.pb-sm-n7{padding-bottom:-28px !important}}@media only screen and (min-width: 960px){.pb-md-7{padding-bottom:28px !important}.pb-md-n7{padding-bottom:-28px !important}}@media only screen and (min-width: 1264px){.pb-lg-7{padding-bottom:28px !important}.pb-lg-n7{padding-bottom:-28px !important}}@media only screen and (min-width: 1904px){.pb-xl-7{padding-bottom:28px !important}.pb-xl-n7{padding-bottom:-28px !important}}@media only screen and (min-width: 600px){.ma-sm-8{margin:32px !important}.ma-sm-n8{margin:-32px !important}}@media only screen and (min-width: 960px){.ma-md-8{margin:32px !important}.ma-md-n8{margin:-32px !important}}@media only screen and (min-width: 1264px){.ma-lg-8{margin:32px !important}.ma-lg-n8{margin:-32px !important}}@media only screen and (min-width: 1904px){.ma-xl-8{margin:32px !important}.ma-xl-n8{margin:-32px !important}}@media only screen and (min-width: 600px){.ml-sm-8{margin-left:32px !important}.ml-sm-n8{margin-left:-32px !important}}@media only screen and (min-width: 960px){.ml-md-8{margin-left:32px !important}.ml-md-n8{margin-left:-32px !important}}@media only screen and (min-width: 1264px){.ml-lg-8{margin-left:32px !important}.ml-lg-n8{margin-left:-32px !important}}@media only screen and (min-width: 1904px){.ml-xl-8{margin-left:32px !important}.ml-xl-n8{margin-left:-32px !important}}@media only screen and (min-width: 600px){.mr-sm-8{margin-right:32px !important}.mr-sm-n8{margin-right:-32px !important}}@media only screen and (min-width: 960px){.mr-md-8{margin-right:32px !important}.mr-md-n8{margin-right:-32px !important}}@media only screen and (min-width: 1264px){.mr-lg-8{margin-right:32px !important}.mr-lg-n8{margin-right:-32px !important}}@media only screen and (min-width: 1904px){.mr-xl-8{margin-right:32px !important}.mr-xl-n8{margin-right:-32px !important}}@media only screen and (min-width: 600px){.mt-sm-8{margin-top:32px !important}.mt-sm-n8{margin-top:-32px !important}}@media only screen and (min-width: 960px){.mt-md-8{margin-top:32px !important}.mt-md-n8{margin-top:-32px !important}}@media only screen and (min-width: 1264px){.mt-lg-8{margin-top:32px !important}.mt-lg-n8{margin-top:-32px !important}}@media only screen and (min-width: 1904px){.mt-xl-8{margin-top:32px !important}.mt-xl-n8{margin-top:-32px !important}}@media only screen and (min-width: 600px){.mb-sm-8{margin-bottom:32px !important}.mb-sm-n8{margin-bottom:-32px !important}}@media only screen and (min-width: 960px){.mb-md-8{margin-bottom:32px !important}.mb-md-n8{margin-bottom:-32px !important}}@media only screen and (min-width: 1264px){.mb-lg-8{margin-bottom:32px !important}.mb-lg-n8{margin-bottom:-32px !important}}@media only screen and (min-width: 1904px){.mb-xl-8{margin-bottom:32px !important}.mb-xl-n8{margin-bottom:-32px !important}}@media only screen and (min-width: 600px){.pa-sm-8{padding:32px !important}.pa-sm-n8{padding:-32px !important}}@media only screen and (min-width: 960px){.pa-md-8{padding:32px !important}.pa-md-n8{padding:-32px !important}}@media only screen and (min-width: 1264px){.pa-lg-8{padding:32px !important}.pa-lg-n8{padding:-32px !important}}@media only screen and (min-width: 1904px){.pa-xl-8{padding:32px !important}.pa-xl-n8{padding:-32px !important}}@media only screen and (min-width: 600px){.pl-sm-8{padding-left:32px !important}.pl-sm-n8{padding-left:-32px !important}}@media only screen and (min-width: 960px){.pl-md-8{padding-left:32px !important}.pl-md-n8{padding-left:-32px !important}}@media only screen and (min-width: 1264px){.pl-lg-8{padding-left:32px !important}.pl-lg-n8{padding-left:-32px !important}}@media only screen and (min-width: 1904px){.pl-xl-8{padding-left:32px !important}.pl-xl-n8{padding-left:-32px !important}}@media only screen and (min-width: 600px){.pr-sm-8{padding-right:32px !important}.pr-sm-n8{padding-right:-32px !important}}@media only screen and (min-width: 960px){.pr-md-8{padding-right:32px !important}.pr-md-n8{padding-right:-32px !important}}@media only screen and (min-width: 1264px){.pr-lg-8{padding-right:32px !important}.pr-lg-n8{padding-right:-32px !important}}@media only screen and (min-width: 1904px){.pr-xl-8{padding-right:32px !important}.pr-xl-n8{padding-right:-32px !important}}@media only screen and (min-width: 600px){.pt-sm-8{padding-top:32px !important}.pt-sm-n8{padding-top:-32px !important}}@media only screen and (min-width: 960px){.pt-md-8{padding-top:32px !important}.pt-md-n8{padding-top:-32px !important}}@media only screen and (min-width: 1264px){.pt-lg-8{padding-top:32px !important}.pt-lg-n8{padding-top:-32px !important}}@media only screen and (min-width: 1904px){.pt-xl-8{padding-top:32px !important}.pt-xl-n8{padding-top:-32px !important}}@media only screen and (min-width: 600px){.pb-sm-8{padding-bottom:32px !important}.pb-sm-n8{padding-bottom:-32px !important}}@media only screen and (min-width: 960px){.pb-md-8{padding-bottom:32px !important}.pb-md-n8{padding-bottom:-32px !important}}@media only screen and (min-width: 1264px){.pb-lg-8{padding-bottom:32px !important}.pb-lg-n8{padding-bottom:-32px !important}}@media only screen and (min-width: 1904px){.pb-xl-8{padding-bottom:32px !important}.pb-xl-n8{padding-bottom:-32px !important}}@media only screen and (min-width: 600px){.ma-sm-9{margin:36px !important}.ma-sm-n9{margin:-36px !important}}@media only screen and (min-width: 960px){.ma-md-9{margin:36px !important}.ma-md-n9{margin:-36px !important}}@media only screen and (min-width: 1264px){.ma-lg-9{margin:36px !important}.ma-lg-n9{margin:-36px !important}}@media only screen and (min-width: 1904px){.ma-xl-9{margin:36px !important}.ma-xl-n9{margin:-36px !important}}@media only screen and (min-width: 600px){.ml-sm-9{margin-left:36px !important}.ml-sm-n9{margin-left:-36px !important}}@media only screen and (min-width: 960px){.ml-md-9{margin-left:36px !important}.ml-md-n9{margin-left:-36px !important}}@media only screen and (min-width: 1264px){.ml-lg-9{margin-left:36px !important}.ml-lg-n9{margin-left:-36px !important}}@media only screen and (min-width: 1904px){.ml-xl-9{margin-left:36px !important}.ml-xl-n9{margin-left:-36px !important}}@media only screen and (min-width: 600px){.mr-sm-9{margin-right:36px !important}.mr-sm-n9{margin-right:-36px !important}}@media only screen and (min-width: 960px){.mr-md-9{margin-right:36px !important}.mr-md-n9{margin-right:-36px !important}}@media only screen and (min-width: 1264px){.mr-lg-9{margin-right:36px !important}.mr-lg-n9{margin-right:-36px !important}}@media only screen and (min-width: 1904px){.mr-xl-9{margin-right:36px !important}.mr-xl-n9{margin-right:-36px !important}}@media only screen and (min-width: 600px){.mt-sm-9{margin-top:36px !important}.mt-sm-n9{margin-top:-36px !important}}@media only screen and (min-width: 960px){.mt-md-9{margin-top:36px !important}.mt-md-n9{margin-top:-36px !important}}@media only screen and (min-width: 1264px){.mt-lg-9{margin-top:36px !important}.mt-lg-n9{margin-top:-36px !important}}@media only screen and (min-width: 1904px){.mt-xl-9{margin-top:36px !important}.mt-xl-n9{margin-top:-36px !important}}@media only screen and (min-width: 600px){.mb-sm-9{margin-bottom:36px !important}.mb-sm-n9{margin-bottom:-36px !important}}@media only screen and (min-width: 960px){.mb-md-9{margin-bottom:36px !important}.mb-md-n9{margin-bottom:-36px !important}}@media only screen and (min-width: 1264px){.mb-lg-9{margin-bottom:36px !important}.mb-lg-n9{margin-bottom:-36px !important}}@media only screen and (min-width: 1904px){.mb-xl-9{margin-bottom:36px !important}.mb-xl-n9{margin-bottom:-36px !important}}@media only screen and (min-width: 600px){.pa-sm-9{padding:36px !important}.pa-sm-n9{padding:-36px !important}}@media only screen and (min-width: 960px){.pa-md-9{padding:36px !important}.pa-md-n9{padding:-36px !important}}@media only screen and (min-width: 1264px){.pa-lg-9{padding:36px !important}.pa-lg-n9{padding:-36px !important}}@media only screen and (min-width: 1904px){.pa-xl-9{padding:36px !important}.pa-xl-n9{padding:-36px !important}}@media only screen and (min-width: 600px){.pl-sm-9{padding-left:36px !important}.pl-sm-n9{padding-left:-36px !important}}@media only screen and (min-width: 960px){.pl-md-9{padding-left:36px !important}.pl-md-n9{padding-left:-36px !important}}@media only screen and (min-width: 1264px){.pl-lg-9{padding-left:36px !important}.pl-lg-n9{padding-left:-36px !important}}@media only screen and (min-width: 1904px){.pl-xl-9{padding-left:36px !important}.pl-xl-n9{padding-left:-36px !important}}@media only screen and (min-width: 600px){.pr-sm-9{padding-right:36px !important}.pr-sm-n9{padding-right:-36px !important}}@media only screen and (min-width: 960px){.pr-md-9{padding-right:36px !important}.pr-md-n9{padding-right:-36px !important}}@media only screen and (min-width: 1264px){.pr-lg-9{padding-right:36px !important}.pr-lg-n9{padding-right:-36px !important}}@media only screen and (min-width: 1904px){.pr-xl-9{padding-right:36px !important}.pr-xl-n9{padding-right:-36px !important}}@media only screen and (min-width: 600px){.pt-sm-9{padding-top:36px !important}.pt-sm-n9{padding-top:-36px !important}}@media only screen and (min-width: 960px){.pt-md-9{padding-top:36px !important}.pt-md-n9{padding-top:-36px !important}}@media only screen and (min-width: 1264px){.pt-lg-9{padding-top:36px !important}.pt-lg-n9{padding-top:-36px !important}}@media only screen and (min-width: 1904px){.pt-xl-9{padding-top:36px !important}.pt-xl-n9{padding-top:-36px !important}}@media only screen and (min-width: 600px){.pb-sm-9{padding-bottom:36px !important}.pb-sm-n9{padding-bottom:-36px !important}}@media only screen and (min-width: 960px){.pb-md-9{padding-bottom:36px !important}.pb-md-n9{padding-bottom:-36px !important}}@media only screen and (min-width: 1264px){.pb-lg-9{padding-bottom:36px !important}.pb-lg-n9{padding-bottom:-36px !important}}@media only screen and (min-width: 1904px){.pb-xl-9{padding-bottom:36px !important}.pb-xl-n9{padding-bottom:-36px !important}}@media only screen and (min-width: 600px){.ma-sm-10{margin:40px !important}.ma-sm-n10{margin:-40px !important}}@media only screen and (min-width: 960px){.ma-md-10{margin:40px !important}.ma-md-n10{margin:-40px !important}}@media only screen and (min-width: 1264px){.ma-lg-10{margin:40px !important}.ma-lg-n10{margin:-40px !important}}@media only screen and (min-width: 1904px){.ma-xl-10{margin:40px !important}.ma-xl-n10{margin:-40px !important}}@media only screen and (min-width: 600px){.ml-sm-10{margin-left:40px !important}.ml-sm-n10{margin-left:-40px !important}}@media only screen and (min-width: 960px){.ml-md-10{margin-left:40px !important}.ml-md-n10{margin-left:-40px !important}}@media only screen and (min-width: 1264px){.ml-lg-10{margin-left:40px !important}.ml-lg-n10{margin-left:-40px !important}}@media only screen and (min-width: 1904px){.ml-xl-10{margin-left:40px !important}.ml-xl-n10{margin-left:-40px !important}}@media only screen and (min-width: 600px){.mr-sm-10{margin-right:40px !important}.mr-sm-n10{margin-right:-40px !important}}@media only screen and (min-width: 960px){.mr-md-10{margin-right:40px !important}.mr-md-n10{margin-right:-40px !important}}@media only screen and (min-width: 1264px){.mr-lg-10{margin-right:40px !important}.mr-lg-n10{margin-right:-40px !important}}@media only screen and (min-width: 1904px){.mr-xl-10{margin-right:40px !important}.mr-xl-n10{margin-right:-40px !important}}@media only screen and (min-width: 600px){.mt-sm-10{margin-top:40px !important}.mt-sm-n10{margin-top:-40px !important}}@media only screen and (min-width: 960px){.mt-md-10{margin-top:40px !important}.mt-md-n10{margin-top:-40px !important}}@media only screen and (min-width: 1264px){.mt-lg-10{margin-top:40px !important}.mt-lg-n10{margin-top:-40px !important}}@media only screen and (min-width: 1904px){.mt-xl-10{margin-top:40px !important}.mt-xl-n10{margin-top:-40px !important}}@media only screen and (min-width: 600px){.mb-sm-10{margin-bottom:40px !important}.mb-sm-n10{margin-bottom:-40px !important}}@media only screen and (min-width: 960px){.mb-md-10{margin-bottom:40px !important}.mb-md-n10{margin-bottom:-40px !important}}@media only screen and (min-width: 1264px){.mb-lg-10{margin-bottom:40px !important}.mb-lg-n10{margin-bottom:-40px !important}}@media only screen and (min-width: 1904px){.mb-xl-10{margin-bottom:40px !important}.mb-xl-n10{margin-bottom:-40px !important}}@media only screen and (min-width: 600px){.pa-sm-10{padding:40px !important}.pa-sm-n10{padding:-40px !important}}@media only screen and (min-width: 960px){.pa-md-10{padding:40px !important}.pa-md-n10{padding:-40px !important}}@media only screen and (min-width: 1264px){.pa-lg-10{padding:40px !important}.pa-lg-n10{padding:-40px !important}}@media only screen and (min-width: 1904px){.pa-xl-10{padding:40px !important}.pa-xl-n10{padding:-40px !important}}@media only screen and (min-width: 600px){.pl-sm-10{padding-left:40px !important}.pl-sm-n10{padding-left:-40px !important}}@media only screen and (min-width: 960px){.pl-md-10{padding-left:40px !important}.pl-md-n10{padding-left:-40px !important}}@media only screen and (min-width: 1264px){.pl-lg-10{padding-left:40px !important}.pl-lg-n10{padding-left:-40px !important}}@media only screen and (min-width: 1904px){.pl-xl-10{padding-left:40px !important}.pl-xl-n10{padding-left:-40px !important}}@media only screen and (min-width: 600px){.pr-sm-10{padding-right:40px !important}.pr-sm-n10{padding-right:-40px !important}}@media only screen and (min-width: 960px){.pr-md-10{padding-right:40px !important}.pr-md-n10{padding-right:-40px !important}}@media only screen and (min-width: 1264px){.pr-lg-10{padding-right:40px !important}.pr-lg-n10{padding-right:-40px !important}}@media only screen and (min-width: 1904px){.pr-xl-10{padding-right:40px !important}.pr-xl-n10{padding-right:-40px !important}}@media only screen and (min-width: 600px){.pt-sm-10{padding-top:40px !important}.pt-sm-n10{padding-top:-40px !important}}@media only screen and (min-width: 960px){.pt-md-10{padding-top:40px !important}.pt-md-n10{padding-top:-40px !important}}@media only screen and (min-width: 1264px){.pt-lg-10{padding-top:40px !important}.pt-lg-n10{padding-top:-40px !important}}@media only screen and (min-width: 1904px){.pt-xl-10{padding-top:40px !important}.pt-xl-n10{padding-top:-40px !important}}@media only screen and (min-width: 600px){.pb-sm-10{padding-bottom:40px !important}.pb-sm-n10{padding-bottom:-40px !important}}@media only screen and (min-width: 960px){.pb-md-10{padding-bottom:40px !important}.pb-md-n10{padding-bottom:-40px !important}}@media only screen and (min-width: 1264px){.pb-lg-10{padding-bottom:40px !important}.pb-lg-n10{padding-bottom:-40px !important}}@media only screen and (min-width: 1904px){.pb-xl-10{padding-bottom:40px !important}.pb-xl-n10{padding-bottom:-40px !important}}@media only screen and (min-width: 600px){.ma-sm-11{margin:44px !important}.ma-sm-n11{margin:-44px !important}}@media only screen and (min-width: 960px){.ma-md-11{margin:44px !important}.ma-md-n11{margin:-44px !important}}@media only screen and (min-width: 1264px){.ma-lg-11{margin:44px !important}.ma-lg-n11{margin:-44px !important}}@media only screen and (min-width: 1904px){.ma-xl-11{margin:44px !important}.ma-xl-n11{margin:-44px !important}}@media only screen and (min-width: 600px){.ml-sm-11{margin-left:44px !important}.ml-sm-n11{margin-left:-44px !important}}@media only screen and (min-width: 960px){.ml-md-11{margin-left:44px !important}.ml-md-n11{margin-left:-44px !important}}@media only screen and (min-width: 1264px){.ml-lg-11{margin-left:44px !important}.ml-lg-n11{margin-left:-44px !important}}@media only screen and (min-width: 1904px){.ml-xl-11{margin-left:44px !important}.ml-xl-n11{margin-left:-44px !important}}@media only screen and (min-width: 600px){.mr-sm-11{margin-right:44px !important}.mr-sm-n11{margin-right:-44px !important}}@media only screen and (min-width: 960px){.mr-md-11{margin-right:44px !important}.mr-md-n11{margin-right:-44px !important}}@media only screen and (min-width: 1264px){.mr-lg-11{margin-right:44px !important}.mr-lg-n11{margin-right:-44px !important}}@media only screen and (min-width: 1904px){.mr-xl-11{margin-right:44px !important}.mr-xl-n11{margin-right:-44px !important}}@media only screen and (min-width: 600px){.mt-sm-11{margin-top:44px !important}.mt-sm-n11{margin-top:-44px !important}}@media only screen and (min-width: 960px){.mt-md-11{margin-top:44px !important}.mt-md-n11{margin-top:-44px !important}}@media only screen and (min-width: 1264px){.mt-lg-11{margin-top:44px !important}.mt-lg-n11{margin-top:-44px !important}}@media only screen and (min-width: 1904px){.mt-xl-11{margin-top:44px !important}.mt-xl-n11{margin-top:-44px !important}}@media only screen and (min-width: 600px){.mb-sm-11{margin-bottom:44px !important}.mb-sm-n11{margin-bottom:-44px !important}}@media only screen and (min-width: 960px){.mb-md-11{margin-bottom:44px !important}.mb-md-n11{margin-bottom:-44px !important}}@media only screen and (min-width: 1264px){.mb-lg-11{margin-bottom:44px !important}.mb-lg-n11{margin-bottom:-44px !important}}@media only screen and (min-width: 1904px){.mb-xl-11{margin-bottom:44px !important}.mb-xl-n11{margin-bottom:-44px !important}}@media only screen and (min-width: 600px){.pa-sm-11{padding:44px !important}.pa-sm-n11{padding:-44px !important}}@media only screen and (min-width: 960px){.pa-md-11{padding:44px !important}.pa-md-n11{padding:-44px !important}}@media only screen and (min-width: 1264px){.pa-lg-11{padding:44px !important}.pa-lg-n11{padding:-44px !important}}@media only screen and (min-width: 1904px){.pa-xl-11{padding:44px !important}.pa-xl-n11{padding:-44px !important}}@media only screen and (min-width: 600px){.pl-sm-11{padding-left:44px !important}.pl-sm-n11{padding-left:-44px !important}}@media only screen and (min-width: 960px){.pl-md-11{padding-left:44px !important}.pl-md-n11{padding-left:-44px !important}}@media only screen and (min-width: 1264px){.pl-lg-11{padding-left:44px !important}.pl-lg-n11{padding-left:-44px !important}}@media only screen and (min-width: 1904px){.pl-xl-11{padding-left:44px !important}.pl-xl-n11{padding-left:-44px !important}}@media only screen and (min-width: 600px){.pr-sm-11{padding-right:44px !important}.pr-sm-n11{padding-right:-44px !important}}@media only screen and (min-width: 960px){.pr-md-11{padding-right:44px !important}.pr-md-n11{padding-right:-44px !important}}@media only screen and (min-width: 1264px){.pr-lg-11{padding-right:44px !important}.pr-lg-n11{padding-right:-44px !important}}@media only screen and (min-width: 1904px){.pr-xl-11{padding-right:44px !important}.pr-xl-n11{padding-right:-44px !important}}@media only screen and (min-width: 600px){.pt-sm-11{padding-top:44px !important}.pt-sm-n11{padding-top:-44px !important}}@media only screen and (min-width: 960px){.pt-md-11{padding-top:44px !important}.pt-md-n11{padding-top:-44px !important}}@media only screen and (min-width: 1264px){.pt-lg-11{padding-top:44px !important}.pt-lg-n11{padding-top:-44px !important}}@media only screen and (min-width: 1904px){.pt-xl-11{padding-top:44px !important}.pt-xl-n11{padding-top:-44px !important}}@media only screen and (min-width: 600px){.pb-sm-11{padding-bottom:44px !important}.pb-sm-n11{padding-bottom:-44px !important}}@media only screen and (min-width: 960px){.pb-md-11{padding-bottom:44px !important}.pb-md-n11{padding-bottom:-44px !important}}@media only screen and (min-width: 1264px){.pb-lg-11{padding-bottom:44px !important}.pb-lg-n11{padding-bottom:-44px !important}}@media only screen and (min-width: 1904px){.pb-xl-11{padding-bottom:44px !important}.pb-xl-n11{padding-bottom:-44px !important}}@media only screen and (min-width: 600px){.ma-sm-12{margin:48px !important}.ma-sm-n12{margin:-48px !important}}@media only screen and (min-width: 960px){.ma-md-12{margin:48px !important}.ma-md-n12{margin:-48px !important}}@media only screen and (min-width: 1264px){.ma-lg-12{margin:48px !important}.ma-lg-n12{margin:-48px !important}}@media only screen and (min-width: 1904px){.ma-xl-12{margin:48px !important}.ma-xl-n12{margin:-48px !important}}@media only screen and (min-width: 600px){.ml-sm-12{margin-left:48px !important}.ml-sm-n12{margin-left:-48px !important}}@media only screen and (min-width: 960px){.ml-md-12{margin-left:48px !important}.ml-md-n12{margin-left:-48px !important}}@media only screen and (min-width: 1264px){.ml-lg-12{margin-left:48px !important}.ml-lg-n12{margin-left:-48px !important}}@media only screen and (min-width: 1904px){.ml-xl-12{margin-left:48px !important}.ml-xl-n12{margin-left:-48px !important}}@media only screen and (min-width: 600px){.mr-sm-12{margin-right:48px !important}.mr-sm-n12{margin-right:-48px !important}}@media only screen and (min-width: 960px){.mr-md-12{margin-right:48px !important}.mr-md-n12{margin-right:-48px !important}}@media only screen and (min-width: 1264px){.mr-lg-12{margin-right:48px !important}.mr-lg-n12{margin-right:-48px !important}}@media only screen and (min-width: 1904px){.mr-xl-12{margin-right:48px !important}.mr-xl-n12{margin-right:-48px !important}}@media only screen and (min-width: 600px){.mt-sm-12{margin-top:48px !important}.mt-sm-n12{margin-top:-48px !important}}@media only screen and (min-width: 960px){.mt-md-12{margin-top:48px !important}.mt-md-n12{margin-top:-48px !important}}@media only screen and (min-width: 1264px){.mt-lg-12{margin-top:48px !important}.mt-lg-n12{margin-top:-48px !important}}@media only screen and (min-width: 1904px){.mt-xl-12{margin-top:48px !important}.mt-xl-n12{margin-top:-48px !important}}@media only screen and (min-width: 600px){.mb-sm-12{margin-bottom:48px !important}.mb-sm-n12{margin-bottom:-48px !important}}@media only screen and (min-width: 960px){.mb-md-12{margin-bottom:48px !important}.mb-md-n12{margin-bottom:-48px !important}}@media only screen and (min-width: 1264px){.mb-lg-12{margin-bottom:48px !important}.mb-lg-n12{margin-bottom:-48px !important}}@media only screen and (min-width: 1904px){.mb-xl-12{margin-bottom:48px !important}.mb-xl-n12{margin-bottom:-48px !important}}@media only screen and (min-width: 600px){.pa-sm-12{padding:48px !important}.pa-sm-n12{padding:-48px !important}}@media only screen and (min-width: 960px){.pa-md-12{padding:48px !important}.pa-md-n12{padding:-48px !important}}@media only screen and (min-width: 1264px){.pa-lg-12{padding:48px !important}.pa-lg-n12{padding:-48px !important}}@media only screen and (min-width: 1904px){.pa-xl-12{padding:48px !important}.pa-xl-n12{padding:-48px !important}}@media only screen and (min-width: 600px){.pl-sm-12{padding-left:48px !important}.pl-sm-n12{padding-left:-48px !important}}@media only screen and (min-width: 960px){.pl-md-12{padding-left:48px !important}.pl-md-n12{padding-left:-48px !important}}@media only screen and (min-width: 1264px){.pl-lg-12{padding-left:48px !important}.pl-lg-n12{padding-left:-48px !important}}@media only screen and (min-width: 1904px){.pl-xl-12{padding-left:48px !important}.pl-xl-n12{padding-left:-48px !important}}@media only screen and (min-width: 600px){.pr-sm-12{padding-right:48px !important}.pr-sm-n12{padding-right:-48px !important}}@media only screen and (min-width: 960px){.pr-md-12{padding-right:48px !important}.pr-md-n12{padding-right:-48px !important}}@media only screen and (min-width: 1264px){.pr-lg-12{padding-right:48px !important}.pr-lg-n12{padding-right:-48px !important}}@media only screen and (min-width: 1904px){.pr-xl-12{padding-right:48px !important}.pr-xl-n12{padding-right:-48px !important}}@media only screen and (min-width: 600px){.pt-sm-12{padding-top:48px !important}.pt-sm-n12{padding-top:-48px !important}}@media only screen and (min-width: 960px){.pt-md-12{padding-top:48px !important}.pt-md-n12{padding-top:-48px !important}}@media only screen and (min-width: 1264px){.pt-lg-12{padding-top:48px !important}.pt-lg-n12{padding-top:-48px !important}}@media only screen and (min-width: 1904px){.pt-xl-12{padding-top:48px !important}.pt-xl-n12{padding-top:-48px !important}}@media only screen and (min-width: 600px){.pb-sm-12{padding-bottom:48px !important}.pb-sm-n12{padding-bottom:-48px !important}}@media only screen and (min-width: 960px){.pb-md-12{padding-bottom:48px !important}.pb-md-n12{padding-bottom:-48px !important}}@media only screen and (min-width: 1264px){.pb-lg-12{padding-bottom:48px !important}.pb-lg-n12{padding-bottom:-48px !important}}@media only screen and (min-width: 1904px){.pb-xl-12{padding-bottom:48px !important}.pb-xl-n12{padding-bottom:-48px !important}}@media only screen and (min-width: 600px){.ma-sm-13{margin:52px !important}.ma-sm-n13{margin:-52px !important}}@media only screen and (min-width: 960px){.ma-md-13{margin:52px !important}.ma-md-n13{margin:-52px !important}}@media only screen and (min-width: 1264px){.ma-lg-13{margin:52px !important}.ma-lg-n13{margin:-52px !important}}@media only screen and (min-width: 1904px){.ma-xl-13{margin:52px !important}.ma-xl-n13{margin:-52px !important}}@media only screen and (min-width: 600px){.ml-sm-13{margin-left:52px !important}.ml-sm-n13{margin-left:-52px !important}}@media only screen and (min-width: 960px){.ml-md-13{margin-left:52px !important}.ml-md-n13{margin-left:-52px !important}}@media only screen and (min-width: 1264px){.ml-lg-13{margin-left:52px !important}.ml-lg-n13{margin-left:-52px !important}}@media only screen and (min-width: 1904px){.ml-xl-13{margin-left:52px !important}.ml-xl-n13{margin-left:-52px !important}}@media only screen and (min-width: 600px){.mr-sm-13{margin-right:52px !important}.mr-sm-n13{margin-right:-52px !important}}@media only screen and (min-width: 960px){.mr-md-13{margin-right:52px !important}.mr-md-n13{margin-right:-52px !important}}@media only screen and (min-width: 1264px){.mr-lg-13{margin-right:52px !important}.mr-lg-n13{margin-right:-52px !important}}@media only screen and (min-width: 1904px){.mr-xl-13{margin-right:52px !important}.mr-xl-n13{margin-right:-52px !important}}@media only screen and (min-width: 600px){.mt-sm-13{margin-top:52px !important}.mt-sm-n13{margin-top:-52px !important}}@media only screen and (min-width: 960px){.mt-md-13{margin-top:52px !important}.mt-md-n13{margin-top:-52px !important}}@media only screen and (min-width: 1264px){.mt-lg-13{margin-top:52px !important}.mt-lg-n13{margin-top:-52px !important}}@media only screen and (min-width: 1904px){.mt-xl-13{margin-top:52px !important}.mt-xl-n13{margin-top:-52px !important}}@media only screen and (min-width: 600px){.mb-sm-13{margin-bottom:52px !important}.mb-sm-n13{margin-bottom:-52px !important}}@media only screen and (min-width: 960px){.mb-md-13{margin-bottom:52px !important}.mb-md-n13{margin-bottom:-52px !important}}@media only screen and (min-width: 1264px){.mb-lg-13{margin-bottom:52px !important}.mb-lg-n13{margin-bottom:-52px !important}}@media only screen and (min-width: 1904px){.mb-xl-13{margin-bottom:52px !important}.mb-xl-n13{margin-bottom:-52px !important}}@media only screen and (min-width: 600px){.pa-sm-13{padding:52px !important}.pa-sm-n13{padding:-52px !important}}@media only screen and (min-width: 960px){.pa-md-13{padding:52px !important}.pa-md-n13{padding:-52px !important}}@media only screen and (min-width: 1264px){.pa-lg-13{padding:52px !important}.pa-lg-n13{padding:-52px !important}}@media only screen and (min-width: 1904px){.pa-xl-13{padding:52px !important}.pa-xl-n13{padding:-52px !important}}@media only screen and (min-width: 600px){.pl-sm-13{padding-left:52px !important}.pl-sm-n13{padding-left:-52px !important}}@media only screen and (min-width: 960px){.pl-md-13{padding-left:52px !important}.pl-md-n13{padding-left:-52px !important}}@media only screen and (min-width: 1264px){.pl-lg-13{padding-left:52px !important}.pl-lg-n13{padding-left:-52px !important}}@media only screen and (min-width: 1904px){.pl-xl-13{padding-left:52px !important}.pl-xl-n13{padding-left:-52px !important}}@media only screen and (min-width: 600px){.pr-sm-13{padding-right:52px !important}.pr-sm-n13{padding-right:-52px !important}}@media only screen and (min-width: 960px){.pr-md-13{padding-right:52px !important}.pr-md-n13{padding-right:-52px !important}}@media only screen and (min-width: 1264px){.pr-lg-13{padding-right:52px !important}.pr-lg-n13{padding-right:-52px !important}}@media only screen and (min-width: 1904px){.pr-xl-13{padding-right:52px !important}.pr-xl-n13{padding-right:-52px !important}}@media only screen and (min-width: 600px){.pt-sm-13{padding-top:52px !important}.pt-sm-n13{padding-top:-52px !important}}@media only screen and (min-width: 960px){.pt-md-13{padding-top:52px !important}.pt-md-n13{padding-top:-52px !important}}@media only screen and (min-width: 1264px){.pt-lg-13{padding-top:52px !important}.pt-lg-n13{padding-top:-52px !important}}@media only screen and (min-width: 1904px){.pt-xl-13{padding-top:52px !important}.pt-xl-n13{padding-top:-52px !important}}@media only screen and (min-width: 600px){.pb-sm-13{padding-bottom:52px !important}.pb-sm-n13{padding-bottom:-52px !important}}@media only screen and (min-width: 960px){.pb-md-13{padding-bottom:52px !important}.pb-md-n13{padding-bottom:-52px !important}}@media only screen and (min-width: 1264px){.pb-lg-13{padding-bottom:52px !important}.pb-lg-n13{padding-bottom:-52px !important}}@media only screen and (min-width: 1904px){.pb-xl-13{padding-bottom:52px !important}.pb-xl-n13{padding-bottom:-52px !important}}@media only screen and (min-width: 600px){.ma-sm-14{margin:56px !important}.ma-sm-n14{margin:-56px !important}}@media only screen and (min-width: 960px){.ma-md-14{margin:56px !important}.ma-md-n14{margin:-56px !important}}@media only screen and (min-width: 1264px){.ma-lg-14{margin:56px !important}.ma-lg-n14{margin:-56px !important}}@media only screen and (min-width: 1904px){.ma-xl-14{margin:56px !important}.ma-xl-n14{margin:-56px !important}}@media only screen and (min-width: 600px){.ml-sm-14{margin-left:56px !important}.ml-sm-n14{margin-left:-56px !important}}@media only screen and (min-width: 960px){.ml-md-14{margin-left:56px !important}.ml-md-n14{margin-left:-56px !important}}@media only screen and (min-width: 1264px){.ml-lg-14{margin-left:56px !important}.ml-lg-n14{margin-left:-56px !important}}@media only screen and (min-width: 1904px){.ml-xl-14{margin-left:56px !important}.ml-xl-n14{margin-left:-56px !important}}@media only screen and (min-width: 600px){.mr-sm-14{margin-right:56px !important}.mr-sm-n14{margin-right:-56px !important}}@media only screen and (min-width: 960px){.mr-md-14{margin-right:56px !important}.mr-md-n14{margin-right:-56px !important}}@media only screen and (min-width: 1264px){.mr-lg-14{margin-right:56px !important}.mr-lg-n14{margin-right:-56px !important}}@media only screen and (min-width: 1904px){.mr-xl-14{margin-right:56px !important}.mr-xl-n14{margin-right:-56px !important}}@media only screen and (min-width: 600px){.mt-sm-14{margin-top:56px !important}.mt-sm-n14{margin-top:-56px !important}}@media only screen and (min-width: 960px){.mt-md-14{margin-top:56px !important}.mt-md-n14{margin-top:-56px !important}}@media only screen and (min-width: 1264px){.mt-lg-14{margin-top:56px !important}.mt-lg-n14{margin-top:-56px !important}}@media only screen and (min-width: 1904px){.mt-xl-14{margin-top:56px !important}.mt-xl-n14{margin-top:-56px !important}}@media only screen and (min-width: 600px){.mb-sm-14{margin-bottom:56px !important}.mb-sm-n14{margin-bottom:-56px !important}}@media only screen and (min-width: 960px){.mb-md-14{margin-bottom:56px !important}.mb-md-n14{margin-bottom:-56px !important}}@media only screen and (min-width: 1264px){.mb-lg-14{margin-bottom:56px !important}.mb-lg-n14{margin-bottom:-56px !important}}@media only screen and (min-width: 1904px){.mb-xl-14{margin-bottom:56px !important}.mb-xl-n14{margin-bottom:-56px !important}}@media only screen and (min-width: 600px){.pa-sm-14{padding:56px !important}.pa-sm-n14{padding:-56px !important}}@media only screen and (min-width: 960px){.pa-md-14{padding:56px !important}.pa-md-n14{padding:-56px !important}}@media only screen and (min-width: 1264px){.pa-lg-14{padding:56px !important}.pa-lg-n14{padding:-56px !important}}@media only screen and (min-width: 1904px){.pa-xl-14{padding:56px !important}.pa-xl-n14{padding:-56px !important}}@media only screen and (min-width: 600px){.pl-sm-14{padding-left:56px !important}.pl-sm-n14{padding-left:-56px !important}}@media only screen and (min-width: 960px){.pl-md-14{padding-left:56px !important}.pl-md-n14{padding-left:-56px !important}}@media only screen and (min-width: 1264px){.pl-lg-14{padding-left:56px !important}.pl-lg-n14{padding-left:-56px !important}}@media only screen and (min-width: 1904px){.pl-xl-14{padding-left:56px !important}.pl-xl-n14{padding-left:-56px !important}}@media only screen and (min-width: 600px){.pr-sm-14{padding-right:56px !important}.pr-sm-n14{padding-right:-56px !important}}@media only screen and (min-width: 960px){.pr-md-14{padding-right:56px !important}.pr-md-n14{padding-right:-56px !important}}@media only screen and (min-width: 1264px){.pr-lg-14{padding-right:56px !important}.pr-lg-n14{padding-right:-56px !important}}@media only screen and (min-width: 1904px){.pr-xl-14{padding-right:56px !important}.pr-xl-n14{padding-right:-56px !important}}@media only screen and (min-width: 600px){.pt-sm-14{padding-top:56px !important}.pt-sm-n14{padding-top:-56px !important}}@media only screen and (min-width: 960px){.pt-md-14{padding-top:56px !important}.pt-md-n14{padding-top:-56px !important}}@media only screen and (min-width: 1264px){.pt-lg-14{padding-top:56px !important}.pt-lg-n14{padding-top:-56px !important}}@media only screen and (min-width: 1904px){.pt-xl-14{padding-top:56px !important}.pt-xl-n14{padding-top:-56px !important}}@media only screen and (min-width: 600px){.pb-sm-14{padding-bottom:56px !important}.pb-sm-n14{padding-bottom:-56px !important}}@media only screen and (min-width: 960px){.pb-md-14{padding-bottom:56px !important}.pb-md-n14{padding-bottom:-56px !important}}@media only screen and (min-width: 1264px){.pb-lg-14{padding-bottom:56px !important}.pb-lg-n14{padding-bottom:-56px !important}}@media only screen and (min-width: 1904px){.pb-xl-14{padding-bottom:56px !important}.pb-xl-n14{padding-bottom:-56px !important}}@media only screen and (min-width: 600px){.ma-sm-15{margin:60px !important}.ma-sm-n15{margin:-60px !important}}@media only screen and (min-width: 960px){.ma-md-15{margin:60px !important}.ma-md-n15{margin:-60px !important}}@media only screen and (min-width: 1264px){.ma-lg-15{margin:60px !important}.ma-lg-n15{margin:-60px !important}}@media only screen and (min-width: 1904px){.ma-xl-15{margin:60px !important}.ma-xl-n15{margin:-60px !important}}@media only screen and (min-width: 600px){.ml-sm-15{margin-left:60px !important}.ml-sm-n15{margin-left:-60px !important}}@media only screen and (min-width: 960px){.ml-md-15{margin-left:60px !important}.ml-md-n15{margin-left:-60px !important}}@media only screen and (min-width: 1264px){.ml-lg-15{margin-left:60px !important}.ml-lg-n15{margin-left:-60px !important}}@media only screen and (min-width: 1904px){.ml-xl-15{margin-left:60px !important}.ml-xl-n15{margin-left:-60px !important}}@media only screen and (min-width: 600px){.mr-sm-15{margin-right:60px !important}.mr-sm-n15{margin-right:-60px !important}}@media only screen and (min-width: 960px){.mr-md-15{margin-right:60px !important}.mr-md-n15{margin-right:-60px !important}}@media only screen and (min-width: 1264px){.mr-lg-15{margin-right:60px !important}.mr-lg-n15{margin-right:-60px !important}}@media only screen and (min-width: 1904px){.mr-xl-15{margin-right:60px !important}.mr-xl-n15{margin-right:-60px !important}}@media only screen and (min-width: 600px){.mt-sm-15{margin-top:60px !important}.mt-sm-n15{margin-top:-60px !important}}@media only screen and (min-width: 960px){.mt-md-15{margin-top:60px !important}.mt-md-n15{margin-top:-60px !important}}@media only screen and (min-width: 1264px){.mt-lg-15{margin-top:60px !important}.mt-lg-n15{margin-top:-60px !important}}@media only screen and (min-width: 1904px){.mt-xl-15{margin-top:60px !important}.mt-xl-n15{margin-top:-60px !important}}@media only screen and (min-width: 600px){.mb-sm-15{margin-bottom:60px !important}.mb-sm-n15{margin-bottom:-60px !important}}@media only screen and (min-width: 960px){.mb-md-15{margin-bottom:60px !important}.mb-md-n15{margin-bottom:-60px !important}}@media only screen and (min-width: 1264px){.mb-lg-15{margin-bottom:60px !important}.mb-lg-n15{margin-bottom:-60px !important}}@media only screen and (min-width: 1904px){.mb-xl-15{margin-bottom:60px !important}.mb-xl-n15{margin-bottom:-60px !important}}@media only screen and (min-width: 600px){.pa-sm-15{padding:60px !important}.pa-sm-n15{padding:-60px !important}}@media only screen and (min-width: 960px){.pa-md-15{padding:60px !important}.pa-md-n15{padding:-60px !important}}@media only screen and (min-width: 1264px){.pa-lg-15{padding:60px !important}.pa-lg-n15{padding:-60px !important}}@media only screen and (min-width: 1904px){.pa-xl-15{padding:60px !important}.pa-xl-n15{padding:-60px !important}}@media only screen and (min-width: 600px){.pl-sm-15{padding-left:60px !important}.pl-sm-n15{padding-left:-60px !important}}@media only screen and (min-width: 960px){.pl-md-15{padding-left:60px !important}.pl-md-n15{padding-left:-60px !important}}@media only screen and (min-width: 1264px){.pl-lg-15{padding-left:60px !important}.pl-lg-n15{padding-left:-60px !important}}@media only screen and (min-width: 1904px){.pl-xl-15{padding-left:60px !important}.pl-xl-n15{padding-left:-60px !important}}@media only screen and (min-width: 600px){.pr-sm-15{padding-right:60px !important}.pr-sm-n15{padding-right:-60px !important}}@media only screen and (min-width: 960px){.pr-md-15{padding-right:60px !important}.pr-md-n15{padding-right:-60px !important}}@media only screen and (min-width: 1264px){.pr-lg-15{padding-right:60px !important}.pr-lg-n15{padding-right:-60px !important}}@media only screen and (min-width: 1904px){.pr-xl-15{padding-right:60px !important}.pr-xl-n15{padding-right:-60px !important}}@media only screen and (min-width: 600px){.pt-sm-15{padding-top:60px !important}.pt-sm-n15{padding-top:-60px !important}}@media only screen and (min-width: 960px){.pt-md-15{padding-top:60px !important}.pt-md-n15{padding-top:-60px !important}}@media only screen and (min-width: 1264px){.pt-lg-15{padding-top:60px !important}.pt-lg-n15{padding-top:-60px !important}}@media only screen and (min-width: 1904px){.pt-xl-15{padding-top:60px !important}.pt-xl-n15{padding-top:-60px !important}}@media only screen and (min-width: 600px){.pb-sm-15{padding-bottom:60px !important}.pb-sm-n15{padding-bottom:-60px !important}}@media only screen and (min-width: 960px){.pb-md-15{padding-bottom:60px !important}.pb-md-n15{padding-bottom:-60px !important}}@media only screen and (min-width: 1264px){.pb-lg-15{padding-bottom:60px !important}.pb-lg-n15{padding-bottom:-60px !important}}@media only screen and (min-width: 1904px){.pb-xl-15{padding-bottom:60px !important}.pb-xl-n15{padding-bottom:-60px !important}}@media only screen and (min-width: 600px){.ma-sm-16{margin:64px !important}.ma-sm-n16{margin:-64px !important}}@media only screen and (min-width: 960px){.ma-md-16{margin:64px !important}.ma-md-n16{margin:-64px !important}}@media only screen and (min-width: 1264px){.ma-lg-16{margin:64px !important}.ma-lg-n16{margin:-64px !important}}@media only screen and (min-width: 1904px){.ma-xl-16{margin:64px !important}.ma-xl-n16{margin:-64px !important}}@media only screen and (min-width: 600px){.ml-sm-16{margin-left:64px !important}.ml-sm-n16{margin-left:-64px !important}}@media only screen and (min-width: 960px){.ml-md-16{margin-left:64px !important}.ml-md-n16{margin-left:-64px !important}}@media only screen and (min-width: 1264px){.ml-lg-16{margin-left:64px !important}.ml-lg-n16{margin-left:-64px !important}}@media only screen and (min-width: 1904px){.ml-xl-16{margin-left:64px !important}.ml-xl-n16{margin-left:-64px !important}}@media only screen and (min-width: 600px){.mr-sm-16{margin-right:64px !important}.mr-sm-n16{margin-right:-64px !important}}@media only screen and (min-width: 960px){.mr-md-16{margin-right:64px !important}.mr-md-n16{margin-right:-64px !important}}@media only screen and (min-width: 1264px){.mr-lg-16{margin-right:64px !important}.mr-lg-n16{margin-right:-64px !important}}@media only screen and (min-width: 1904px){.mr-xl-16{margin-right:64px !important}.mr-xl-n16{margin-right:-64px !important}}@media only screen and (min-width: 600px){.mt-sm-16{margin-top:64px !important}.mt-sm-n16{margin-top:-64px !important}}@media only screen and (min-width: 960px){.mt-md-16{margin-top:64px !important}.mt-md-n16{margin-top:-64px !important}}@media only screen and (min-width: 1264px){.mt-lg-16{margin-top:64px !important}.mt-lg-n16{margin-top:-64px !important}}@media only screen and (min-width: 1904px){.mt-xl-16{margin-top:64px !important}.mt-xl-n16{margin-top:-64px !important}}@media only screen and (min-width: 600px){.mb-sm-16{margin-bottom:64px !important}.mb-sm-n16{margin-bottom:-64px !important}}@media only screen and (min-width: 960px){.mb-md-16{margin-bottom:64px !important}.mb-md-n16{margin-bottom:-64px !important}}@media only screen and (min-width: 1264px){.mb-lg-16{margin-bottom:64px !important}.mb-lg-n16{margin-bottom:-64px !important}}@media only screen and (min-width: 1904px){.mb-xl-16{margin-bottom:64px !important}.mb-xl-n16{margin-bottom:-64px !important}}@media only screen and (min-width: 600px){.pa-sm-16{padding:64px !important}.pa-sm-n16{padding:-64px !important}}@media only screen and (min-width: 960px){.pa-md-16{padding:64px !important}.pa-md-n16{padding:-64px !important}}@media only screen and (min-width: 1264px){.pa-lg-16{padding:64px !important}.pa-lg-n16{padding:-64px !important}}@media only screen and (min-width: 1904px){.pa-xl-16{padding:64px !important}.pa-xl-n16{padding:-64px !important}}@media only screen and (min-width: 600px){.pl-sm-16{padding-left:64px !important}.pl-sm-n16{padding-left:-64px !important}}@media only screen and (min-width: 960px){.pl-md-16{padding-left:64px !important}.pl-md-n16{padding-left:-64px !important}}@media only screen and (min-width: 1264px){.pl-lg-16{padding-left:64px !important}.pl-lg-n16{padding-left:-64px !important}}@media only screen and (min-width: 1904px){.pl-xl-16{padding-left:64px !important}.pl-xl-n16{padding-left:-64px !important}}@media only screen and (min-width: 600px){.pr-sm-16{padding-right:64px !important}.pr-sm-n16{padding-right:-64px !important}}@media only screen and (min-width: 960px){.pr-md-16{padding-right:64px !important}.pr-md-n16{padding-right:-64px !important}}@media only screen and (min-width: 1264px){.pr-lg-16{padding-right:64px !important}.pr-lg-n16{padding-right:-64px !important}}@media only screen and (min-width: 1904px){.pr-xl-16{padding-right:64px !important}.pr-xl-n16{padding-right:-64px !important}}@media only screen and (min-width: 600px){.pt-sm-16{padding-top:64px !important}.pt-sm-n16{padding-top:-64px !important}}@media only screen and (min-width: 960px){.pt-md-16{padding-top:64px !important}.pt-md-n16{padding-top:-64px !important}}@media only screen and (min-width: 1264px){.pt-lg-16{padding-top:64px !important}.pt-lg-n16{padding-top:-64px !important}}@media only screen and (min-width: 1904px){.pt-xl-16{padding-top:64px !important}.pt-xl-n16{padding-top:-64px !important}}@media only screen and (min-width: 600px){.pb-sm-16{padding-bottom:64px !important}.pb-sm-n16{padding-bottom:-64px !important}}@media only screen and (min-width: 960px){.pb-md-16{padding-bottom:64px !important}.pb-md-n16{padding-bottom:-64px !important}}@media only screen and (min-width: 1264px){.pb-lg-16{padding-bottom:64px !important}.pb-lg-n16{padding-bottom:-64px !important}}@media only screen and (min-width: 1904px){.pb-xl-16{padding-bottom:64px !important}.pb-xl-n16{padding-bottom:-64px !important}}.ma-auto{margin:auto !important}.ml-auto{margin-left:auto !important}.mr-auto{margin-right:auto !important}.mt-auto{margin-top:auto !important}.mb-auto{margin-bottom:auto !important}.pa-auto{padding:auto !important}.pl-auto{padding-left:auto !important}.pr-auto{padding-right:auto !important}.pt-auto{padding-top:auto !important}.pb-auto{padding-bottom:auto !important}@media only screen and (min-width: 600px){.ma-sm-auto{margin:auto !important}}@media only screen and (min-width: 960px){.ma-md-auto{margin:auto !important}}@media only screen and (min-width: 1264px){.ma-lg-auto{margin:auto !important}}@media only screen and (min-width: 1904px){.ma-xl-auto{margin:auto !important}}@media only screen and (min-width: 600px){.ml-sm-auto{margin-left:auto !important}}@media only screen and (min-width: 960px){.ml-md-auto{margin-left:auto !important}}@media only screen and (min-width: 1264px){.ml-lg-auto{margin-left:auto !important}}@media only screen and (min-width: 1904px){.ml-xl-auto{margin-left:auto !important}}@media only screen and (min-width: 600px){.mr-sm-auto{margin-right:auto !important}}@media only screen and (min-width: 960px){.mr-md-auto{margin-right:auto !important}}@media only screen and (min-width: 1264px){.mr-lg-auto{margin-right:auto !important}}@media only screen and (min-width: 1904px){.mr-xl-auto{margin-right:auto !important}}@media only screen and (min-width: 600px){.mt-sm-auto{margin-top:auto !important}}@media only screen and (min-width: 960px){.mt-md-auto{margin-top:auto !important}}@media only screen and (min-width: 1264px){.mt-lg-auto{margin-top:auto !important}}@media only screen and (min-width: 1904px){.mt-xl-auto{margin-top:auto !important}}@media only screen and (min-width: 600px){.mb-sm-auto{margin-bottom:auto !important}}@media only screen and (min-width: 960px){.mb-md-auto{margin-bottom:auto !important}}@media only screen and (min-width: 1264px){.mb-lg-auto{margin-bottom:auto !important}}@media only screen and (min-width: 1904px){.mb-xl-auto{margin-bottom:auto !important}}@media only screen and (min-width: 600px){.pa-sm-auto{padding:auto !important}}@media only screen and (min-width: 960px){.pa-md-auto{padding:auto !important}}@media only screen and (min-width: 1264px){.pa-lg-auto{padding:auto !important}}@media only screen and (min-width: 1904px){.pa-xl-auto{padding:auto !important}}@media only screen and (min-width: 600px){.pl-sm-auto{padding-left:auto !important}}@media only screen and (min-width: 960px){.pl-md-auto{padding-left:auto !important}}@media only screen and (min-width: 1264px){.pl-lg-auto{padding-left:auto !important}}@media only screen and (min-width: 1904px){.pl-xl-auto{padding-left:auto !important}}@media only screen and (min-width: 600px){.pr-sm-auto{padding-right:auto !important}}@media only screen and (min-width: 960px){.pr-md-auto{padding-right:auto !important}}@media only screen and (min-width: 1264px){.pr-lg-auto{padding-right:auto !important}}@media only screen and (min-width: 1904px){.pr-xl-auto{padding-right:auto !important}}@media only screen and (min-width: 600px){.pt-sm-auto{padding-top:auto !important}}@media only screen and (min-width: 960px){.pt-md-auto{padding-top:auto !important}}@media only screen and (min-width: 1264px){.pt-lg-auto{padding-top:auto !important}}@media only screen and (min-width: 1904px){.pt-xl-auto{padding-top:auto !important}}@media only screen and (min-width: 600px){.pb-sm-auto{padding-bottom:auto !important}}@media only screen and (min-width: 960px){.pb-md-auto{padding-bottom:auto !important}}@media only screen and (min-width: 1264px){.pb-lg-auto{padding-bottom:auto !important}}@media only screen and (min-width: 1904px){.pb-xl-auto{padding-bottom:auto !important}}.d-none{display:none}.d-inline{display:inline}.d-inline-block{display:inline-block}.d-block{display:block}.d-flex{display:flex}.d-inline-flex{display:inline-flex}@media only screen and (min-width: 600px){.d-sm-none{display:none}}@media only screen and (min-width: 960px){.d-md-none{display:none}}@media only screen and (min-width: 1264px){.d-lg-none{display:none}}@media only screen and (min-width: 1904px){.d-xl-none{display:none}}@media only screen and (min-width: 600px){.d-sm-inline{display:inline}}@media only screen and (min-width: 960px){.d-md-inline{display:inline}}@media only screen and (min-width: 1264px){.d-lg-inline{display:inline}}@media only screen and (min-width: 1904px){.d-xl-inline{display:inline}}@media only screen and (min-width: 600px){.d-sm-inline-block{display:inline-block}}@media only screen and (min-width: 960px){.d-md-inline-block{display:inline-block}}@media only screen and (min-width: 1264px){.d-lg-inline-block{display:inline-block}}@media only screen and (min-width: 1904px){.d-xl-inline-block{display:inline-block}}@media only screen and (min-width: 600px){.d-sm-block{display:block}}@media only screen and (min-width: 960px){.d-md-block{display:block}}@media only screen and (min-width: 1264px){.d-lg-block{display:block}}@media only screen and (min-width: 1904px){.d-xl-block{display:block}}@media only screen and (min-width: 600px){.d-sm-flex{display:flex}}@media only screen and (min-width: 960px){.d-md-flex{display:flex}}@media only screen and (min-width: 1264px){.d-lg-flex{display:flex}}@media only screen and (min-width: 1904px){.d-xl-flex{display:flex}}@media only screen and (min-width: 600px){.d-sm-inline-flex{display:inline-flex}}@media only screen and (min-width: 960px){.d-md-inline-flex{display:inline-flex}}@media only screen and (min-width: 1264px){.d-lg-inline-flex{display:inline-flex}}@media only screen and (min-width: 1904px){.d-xl-inline-flex{display:inline-flex}}.flex-row{flex-direction:row}.flex-row-reverse{flex-direction:row-reverse}.flex-column{flex-direction:column}.flex-column-reverse{flex-direction:column-reverse}@media only screen and (min-width: 600px){.flex-sm-row{flex-direction:row}.flex-sm-row-reverse{flex-direction:row-reverse}.flex-sm-column{flex-direction:column}.flex-sm-column-reverse{flex-direction:column-reverse}}@media only screen and (min-width: 960px){.flex-md-row{flex-direction:row}.flex-md-row-reverse{flex-direction:row-reverse}.flex-md-column{flex-direction:column}.flex-md-column-reverse{flex-direction:column-reverse}}@media only screen and (min-width: 1264px){.flex-lg-row{flex-direction:row}.flex-lg-row-reverse{flex-direction:row-reverse}.flex-lg-column{flex-direction:column}.flex-lg-column-reverse{flex-direction:column-reverse}}@media only screen and (min-width: 1904px){.flex-xl-row{flex-direction:row}.flex-xl-row-reverse{flex-direction:row-reverse}.flex-xl-column{flex-direction:column}.flex-xl-column-reverse{flex-direction:column-reverse}}.justify-start{justify-content:flex-start}.justify-end{justify-content:flex-end}.justify-center{justify-content:center}.justify-space-between{justify-content:space-between}.justify-space-around{justify-content:space-around}@media only screen and (min-width: 600px){.justify-sm-start{justify-content:flex-start}.justify-sm-end{justify-content:flex-end}.justify-sm-center{justify-content:center}.justify-sm-space-between{justify-content:space-between}.justify-sm-space-around{justify-content:space-around}}@media only screen and (min-width: 960px){.justify-md-start{justify-content:flex-start}.justify-md-end{justify-content:flex-end}.justify-md-center{justify-content:center}.justify-md-space-between{justify-content:space-between}.justify-md-space-around{justify-content:space-around}}@media only screen and (min-width: 1264px){.justify-lg-start{justify-content:flex-start}.justify-lg-end{justify-content:flex-end}.justify-lg-center{justify-content:center}.justify-lg-space-between{justify-content:space-between}.justify-lg-space-around{justify-content:space-around}}@media only screen and (min-width: 1904px){.justify-xl-start{justify-content:flex-start}.justify-xl-end{justify-content:flex-end}.justify-xl-center{justify-content:center}.justify-xl-space-between{justify-content:space-between}.justify-xl-space-around{justify-content:space-around}}.align-content-start{align-content:flex-start}.align-content-end{align-content:flex-end}.align-content-center{align-content:center}.align-content-space-between{align-content:space-between}.align-content-space-around{align-content:space-around}.align-content-stretch{align-content:stretch}@media only screen and (min-width: 600px){.align-sm-content-start{align-content:flex-start}.align-sm-content-end{align-content:flex-end}.align-sm-content-center{align-content:center}.align-sm-content-space-between{align-content:space-between}.align-sm-content-space-around{align-content:space-around}.align-sm-content-stretch{align-content:stretch}}@media only screen and (min-width: 960px){.align-md-content-start{align-content:flex-start}.align-md-content-end{align-content:flex-end}.align-md-content-center{align-content:center}.align-md-content-space-between{align-content:space-between}.align-md-content-space-around{align-content:space-around}.align-md-content-stretch{align-content:stretch}}@media only screen and (min-width: 1264px){.align-lg-content-start{align-content:flex-start}.align-lg-content-end{align-content:flex-end}.align-lg-content-center{align-content:center}.align-lg-content-space-between{align-content:space-between}.align-lg-content-space-around{align-content:space-around}.align-lg-content-stretch{align-content:stretch}}@media only screen and (min-width: 1904px){.align-xl-content-start{align-content:flex-start}.align-xl-content-end{align-content:flex-end}.align-xl-content-center{align-content:center}.align-xl-content-space-between{align-content:space-between}.align-xl-content-space-around{align-content:space-around}.align-xl-content-stretch{align-content:stretch}}.align-start{align-items:flex-start}.align-end{align-items:flex-end}.align-center{align-items:center}.align-baseline{align-items:baseline}.align-stretch{align-items:stretch}@media only screen and (min-width: 600px){.align-sm-start{align-items:flex-start}.align-sm-end{align-items:flex-end}.align-sm-center{align-items:center}.align-sm-baseline{align-items:baseline}.align-sm-stretch{align-items:stretch}}@media only screen and (min-width: 960px){.align-md-start{align-items:flex-start}.align-md-end{align-items:flex-end}.align-md-center{align-items:center}.align-md-baseline{align-items:baseline}.align-md-stretch{align-items:stretch}}@media only screen and (min-width: 1264px){.align-lg-start{align-items:flex-start}.align-lg-end{align-items:flex-end}.align-lg-center{align-items:center}.align-lg-baseline{align-items:baseline}.align-lg-stretch{align-items:stretch}}@media only screen and (min-width: 1904px){.align-xl-start{align-items:flex-start}.align-xl-end{align-items:flex-end}.align-xl-center{align-items:center}.align-xl-baseline{align-items:baseline}.align-xl-stretch{align-items:stretch}}.align-self-start{align-self:flex-start}.align-self-end{align-self:flex-end}.align-self-center{align-self:center}.align-self-baseline{align-self:baseline}.align-self-stretch{align-self:stretch}.align-self-auto{align-self:auto}@media only screen and (min-width: 600px){.align-self-sm-start{align-self:flex-start}.align-self-sm-end{align-self:flex-end}.align-self-sm-center{align-self:center}.align-self-sm-baseline{align-self:baseline}.align-self-sm-stretch{align-self:stretch}.align-self-sm-auto{align-self:auto}}@media only screen and (min-width: 960px){.align-self-md-start{align-self:flex-start}.align-self-md-end{align-self:flex-end}.align-self-md-center{align-self:center}.align-self-md-baseline{align-self:baseline}.align-self-md-stretch{align-self:stretch}.align-self-md-auto{align-self:auto}}@media only screen and (min-width: 1264px){.align-self-lg-start{align-self:flex-start}.align-self-lg-end{align-self:flex-end}.align-self-lg-center{align-self:center}.align-self-lg-baseline{align-self:baseline}.align-self-lg-stretch{align-self:stretch}.align-self-lg-auto{align-self:auto}}@media only screen and (min-width: 1904px){.align-self-xl-start{align-self:flex-start}.align-self-xl-end{align-self:flex-end}.align-self-xl-center{align-self:center}.align-self-xl-baseline{align-self:baseline}.align-self-xl-stretch{align-self:stretch}.align-self-xl-auto{align-self:auto}}.flex-nowrap{flex-wrap:nowrap}.flex-wrap{flex-wrap:wrap}.flex-wrap-reverse{flex-wrap:wrap-reverse}@media only screen and (min-width: 600px){.flex-sm-nowrap{flex-wrap:nowrap}.flex-sm-wrap{flex-wrap:wrap}.flex-sm-wrap-reverse{flex-wrap:wrap-reverse}}@media only screen and (min-width: 960px){.flex-md-nowrap{flex-wrap:nowrap}.flex-md-wrap{flex-wrap:wrap}.flex-md-wrap-reverse{flex-wrap:wrap-reverse}}@media only screen and (min-width: 1264px){.flex-lg-nowrap{flex-wrap:nowrap}.flex-lg-wrap{flex-wrap:wrap}.flex-lg-wrap-reverse{flex-wrap:wrap-reverse}}@media only screen and (min-width: 1904px){.flex-xl-nowrap{flex-wrap:nowrap}.flex-xl-wrap{flex-wrap:wrap}.flex-xl-wrap-reverse{flex-wrap:wrap-reverse}}.order-first{order:-1}.order-last{order:13}.order-0{order:0}.order-1{order:1}.order-2{order:2}.order-3{order:3}.order-4{order:4}.order-5{order:5}.order-6{order:6}.order-7{order:7}.order-8{order:8}.order-9{order:9}.order-10{order:10}.order-11{order:11}.order-12{order:12}@media only screen and (min-width: 600px){.order-sm-first{order:-1}.order-sm-last{order:13}.order-sm-0{order:0}.order-sm-1{order:1}.order-sm-2{order:2}.order-sm-3{order:3}.order-sm-4{order:4}.order-sm-5{order:5}.order-sm-6{order:6}.order-sm-7{order:7}.order-sm-8{order:8}.order-sm-9{order:9}.order-sm-10{order:10}.order-sm-11{order:11}.order-sm-12{order:12}}@media only screen and (min-width: 960px){.order-md-first{order:-1}.order-md-last{order:13}.order-md-0{order:0}.order-md-1{order:1}.order-md-2{order:2}.order-md-3{order:3}.order-md-4{order:4}.order-md-5{order:5}.order-md-6{order:6}.order-md-7{order:7}.order-md-8{order:8}.order-md-9{order:9}.order-md-10{order:10}.order-md-11{order:11}.order-md-12{order:12}}@media only screen and (min-width: 1264px){.order-lg-first{order:-1}.order-lg-last{order:13}.order-lg-0{order:0}.order-lg-1{order:1}.order-lg-2{order:2}.order-lg-3{order:3}.order-lg-4{order:4}.order-lg-5{order:5}.order-lg-6{order:6}.order-lg-7{order:7}.order-lg-8{order:8}.order-lg-9{order:9}.order-lg-10{order:10}.order-lg-11{order:11}.order-lg-12{order:12}}@media only screen and (min-width: 1904px){.order-xl-first{order:-1}.order-xl-last{order:13}.order-xl-0{order:0}.order-xl-1{order:1}.order-xl-2{order:2}.order-xl-3{order:3}.order-xl-4{order:4}.order-xl-5{order:5}.order-xl-6{order:6}.order-xl-7{order:7}.order-xl-8{order:8}.order-xl-9{order:9}.order-xl-10{order:10}.order-xl-11{order:11}.order-xl-12{order:12}}.flex-grow-0{flex-grow:0}.flex-grow-1{flex-grow:1}.flex-shrink-0{flex-shrink:0}.flex-shrink-1{flex-shrink:1}@media only screen and (min-width: 600px){.flex-sm-grow-0{flex-grow:0}.flex-sm-grow-1{flex-grow:1}.flex-sm-shrink-0{flex-shrink:0}.flex-sm-shrink-1{flex-shrink:1}}@media only screen and (min-width: 960px){.flex-md-grow-0{flex-grow:0}.flex-md-grow-1{flex-grow:1}.flex-md-shrink-0{flex-shrink:0}.flex-md-shrink-1{flex-shrink:1}}@media only screen and (min-width: 1264px){.flex-lg-grow-0{flex-grow:0}.flex-lg-grow-1{flex-grow:1}.flex-lg-shrink-0{flex-shrink:0}.flex-lg-shrink-1{flex-shrink:1}}@media only screen and (min-width: 1904px){.flex-xl-grow-0{flex-grow:0}.flex-xl-grow-1{flex-grow:1}.flex-xl-shrink-0{flex-shrink:0}.flex-xl-shrink-1{flex-shrink:1}}.float-left{float:left}.float-right{float:right}.float-none{float:none}@media only screen and (min-width: 600px){.float-sm-left{float:left}.float-sm-right{float:right}.float-sm-none{float:none}}@media only screen and (min-width: 960px){.float-md-left{float:left}.float-md-right{float:right}.float-md-none{float:none}}@media only screen and (min-width: 1264px){.float-lg-left{float:left}.float-lg-right{float:right}.float-lg-none{float:none}}@media only screen and (min-width: 1904px){.float-xl-left{float:left}.float-xl-right{float:right}.float-xl-none{float:none}}body,html{height:100%}html{font-size:16px;overflow-x:hidden;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-tap-highlight-color:rgba(0, 0, 0, 0)}body{font-family:Roboto,Segoe UI,sans-serif;line-height:1.5}p{margin-bottom:16px}.s-ripple-container{position:relative;overflow:hidden}blockquote{padding:16px 0 16px 24px;font-size:18px;font-weight:300}code,kbd{border-radius:3px;font-size:85%;font-weight:900}code{background-color:#fbe5e1;color:#c0341d;padding:0 .4rem}kbd{background:#212529;color:#fff;padding:.2rem .4rem}h1{font-size:6rem;line-height:6rem;letter-spacing:-.015625em}h1,h2{font-weight:300;font-family:Roboto,Segoe UI,sans-serif}h2{font-size:3.75rem;line-height:3.75rem;letter-spacing:-.0083333333em}h3{font-size:3rem;line-height:3.125rem;letter-spacing:normal}h3,h4{font-weight:400;font-family:Roboto,Segoe UI,sans-serif}h4{font-size:2.125rem;line-height:2.5rem;letter-spacing:.0073529412em}h5{font-size:1.5rem;font-weight:400;letter-spacing:normal}h5,h6{line-height:2rem;font-family:Roboto,Segoe UI,sans-serif}h6{font-size:1.25rem;font-weight:500;letter-spacing:.0125em}.text-h1{font-size:6rem;line-height:6rem;letter-spacing:-.015625em}.text-h1,.text-h2{font-weight:300;font-family:Roboto,Segoe UI,sans-serif}.text-h2{font-size:3.75rem;line-height:3.75rem;letter-spacing:-.0083333333em}.text-h3{font-size:3rem;line-height:3.125rem;letter-spacing:normal}.text-h3,.text-h4{font-weight:400;font-family:Roboto,Segoe UI,sans-serif}.text-h4{font-size:2.125rem;line-height:2.5rem;letter-spacing:.0073529412em}.text-h5{font-size:1.5rem;font-weight:400;letter-spacing:normal}.text-h5,.text-h6{line-height:2rem;font-family:Roboto,Segoe UI,sans-serif}.text-h6{font-size:1.25rem;font-weight:500;letter-spacing:.0125em}.text-subtitle-1{font-size:1rem;font-weight:400;line-height:1.75rem;letter-spacing:.009375em}.text-subtitle-1,.text-subtitle-2{font-family:Roboto,Segoe UI,sans-serif}.text-subtitle-2{font-size:.875rem;font-weight:500;line-height:1.375rem;letter-spacing:.0071428571em}.text-body-1{font-size:1rem;line-height:1.5rem;letter-spacing:.03125em}.text-body-1,.text-body-2{font-weight:400;font-family:Roboto,Segoe UI,sans-serif}.text-body-2{font-size:.875rem;line-height:1.25rem;letter-spacing:.0178571429em}.text-button{font-size:.875rem;font-weight:500;line-height:2.25rem;letter-spacing:.0892857143em;font-family:Roboto,Segoe UI,sans-serif;text-transform:uppercase}.text-caption{font-weight:400;line-height:1.25rem;letter-spacing:.0333333333em}.text-caption,.text-overline{font-size:.75rem;font-family:Roboto,Segoe UI,sans-serif}.text-overline{font-weight:500;line-height:2rem;letter-spacing:.1666666667em;text-transform:uppercase}@media only screen and (min-width: 600px){.text-sm-h1{font-size:6rem;font-weight:300;line-height:6rem;letter-spacing:-.015625em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 960px){.text-md-h1{font-size:6rem;font-weight:300;line-height:6rem;letter-spacing:-.015625em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 1264px){.text-lg-h1{font-size:6rem;font-weight:300;line-height:6rem;letter-spacing:-.015625em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 1904px){.text-xl-h1{font-size:6rem;font-weight:300;line-height:6rem;letter-spacing:-.015625em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 600px){.text-sm-h2{font-size:3.75rem;font-weight:300;line-height:3.75rem;letter-spacing:-.0083333333em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 960px){.text-md-h2{font-size:3.75rem;font-weight:300;line-height:3.75rem;letter-spacing:-.0083333333em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 1264px){.text-lg-h2{font-size:3.75rem;font-weight:300;line-height:3.75rem;letter-spacing:-.0083333333em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 1904px){.text-xl-h2{font-size:3.75rem;font-weight:300;line-height:3.75rem;letter-spacing:-.0083333333em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 600px){.text-sm-h3{font-size:3rem;font-weight:400;line-height:3.125rem;letter-spacing:normal;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 960px){.text-md-h3{font-size:3rem;font-weight:400;line-height:3.125rem;letter-spacing:normal;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 1264px){.text-lg-h3{font-size:3rem;font-weight:400;line-height:3.125rem;letter-spacing:normal;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 1904px){.text-xl-h3{font-size:3rem;font-weight:400;line-height:3.125rem;letter-spacing:normal;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 600px){.text-sm-h4{font-size:2.125rem;font-weight:400;line-height:2.5rem;letter-spacing:.0073529412em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 960px){.text-md-h4{font-size:2.125rem;font-weight:400;line-height:2.5rem;letter-spacing:.0073529412em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 1264px){.text-lg-h4{font-size:2.125rem;font-weight:400;line-height:2.5rem;letter-spacing:.0073529412em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 1904px){.text-xl-h4{font-size:2.125rem;font-weight:400;line-height:2.5rem;letter-spacing:.0073529412em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 600px){.text-sm-h5{font-size:1.5rem;font-weight:400;line-height:2rem;letter-spacing:normal;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 960px){.text-md-h5{font-size:1.5rem;font-weight:400;line-height:2rem;letter-spacing:normal;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 1264px){.text-lg-h5{font-size:1.5rem;font-weight:400;line-height:2rem;letter-spacing:normal;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 1904px){.text-xl-h5{font-size:1.5rem;font-weight:400;line-height:2rem;letter-spacing:normal;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 600px){.text-sm-h6{font-size:1.25rem;font-weight:500;line-height:2rem;letter-spacing:.0125em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 960px){.text-md-h6{font-size:1.25rem;font-weight:500;line-height:2rem;letter-spacing:.0125em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 1264px){.text-lg-h6{font-size:1.25rem;font-weight:500;line-height:2rem;letter-spacing:.0125em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 1904px){.text-xl-h6{font-size:1.25rem;font-weight:500;line-height:2rem;letter-spacing:.0125em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 600px){.text-sm-subtitle-1{font-size:1rem;font-weight:400;line-height:1.75rem;letter-spacing:.009375em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 960px){.text-md-subtitle-1{font-size:1rem;font-weight:400;line-height:1.75rem;letter-spacing:.009375em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 1264px){.text-lg-subtitle-1{font-size:1rem;font-weight:400;line-height:1.75rem;letter-spacing:.009375em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 1904px){.text-xl-subtitle-1{font-size:1rem;font-weight:400;line-height:1.75rem;letter-spacing:.009375em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 600px){.text-sm-subtitle-2{font-size:.875rem;font-weight:500;line-height:1.375rem;letter-spacing:.0071428571em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 960px){.text-md-subtitle-2{font-size:.875rem;font-weight:500;line-height:1.375rem;letter-spacing:.0071428571em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 1264px){.text-lg-subtitle-2{font-size:.875rem;font-weight:500;line-height:1.375rem;letter-spacing:.0071428571em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 1904px){.text-xl-subtitle-2{font-size:.875rem;font-weight:500;line-height:1.375rem;letter-spacing:.0071428571em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 600px){.text-sm-body-1{font-size:1rem;font-weight:400;line-height:1.5rem;letter-spacing:.03125em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 960px){.text-md-body-1{font-size:1rem;font-weight:400;line-height:1.5rem;letter-spacing:.03125em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 1264px){.text-lg-body-1{font-size:1rem;font-weight:400;line-height:1.5rem;letter-spacing:.03125em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 1904px){.text-xl-body-1{font-size:1rem;font-weight:400;line-height:1.5rem;letter-spacing:.03125em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 600px){.text-sm-body-2{font-size:.875rem;font-weight:400;line-height:1.25rem;letter-spacing:.0178571429em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 960px){.text-md-body-2{font-size:.875rem;font-weight:400;line-height:1.25rem;letter-spacing:.0178571429em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 1264px){.text-lg-body-2{font-size:.875rem;font-weight:400;line-height:1.25rem;letter-spacing:.0178571429em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 1904px){.text-xl-body-2{font-size:.875rem;font-weight:400;line-height:1.25rem;letter-spacing:.0178571429em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 600px){.text-sm-button{font-size:.875rem;font-weight:500;line-height:2.25rem;letter-spacing:.0892857143em;font-family:Roboto,Segoe UI,sans-serif;text-transform:uppercase}}@media only screen and (min-width: 960px){.text-md-button{font-size:.875rem;font-weight:500;line-height:2.25rem;letter-spacing:.0892857143em;font-family:Roboto,Segoe UI,sans-serif;text-transform:uppercase}}@media only screen and (min-width: 1264px){.text-lg-button{font-size:.875rem;font-weight:500;line-height:2.25rem;letter-spacing:.0892857143em;font-family:Roboto,Segoe UI,sans-serif;text-transform:uppercase}}@media only screen and (min-width: 1904px){.text-xl-button{font-size:.875rem;font-weight:500;line-height:2.25rem;letter-spacing:.0892857143em;font-family:Roboto,Segoe UI,sans-serif;text-transform:uppercase}}@media only screen and (min-width: 600px){.text-sm-caption{font-size:.75rem;font-weight:400;line-height:1.25rem;letter-spacing:.0333333333em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 960px){.text-md-caption{font-size:.75rem;font-weight:400;line-height:1.25rem;letter-spacing:.0333333333em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 1264px){.text-lg-caption{font-size:.75rem;font-weight:400;line-height:1.25rem;letter-spacing:.0333333333em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 1904px){.text-xl-caption{font-size:.75rem;font-weight:400;line-height:1.25rem;letter-spacing:.0333333333em;font-family:Roboto,Segoe UI,sans-serif}}@media only screen and (min-width: 600px){.text-sm-overline{font-size:.75rem;font-weight:500;line-height:2rem;letter-spacing:.1666666667em;font-family:Roboto,Segoe UI,sans-serif;text-transform:uppercase}}@media only screen and (min-width: 960px){.text-md-overline{font-size:.75rem;font-weight:500;line-height:2rem;letter-spacing:.1666666667em;font-family:Roboto,Segoe UI,sans-serif;text-transform:uppercase}}@media only screen and (min-width: 1264px){.text-lg-overline{font-size:.75rem;font-weight:500;line-height:2rem;letter-spacing:.1666666667em;font-family:Roboto,Segoe UI,sans-serif;text-transform:uppercase}}@media only screen and (min-width: 1904px){.text-xl-overline{font-size:.75rem;font-weight:500;line-height:2rem;letter-spacing:.1666666667em;font-family:Roboto,Segoe UI,sans-serif;text-transform:uppercase}}ol,ul{padding-left:24px}.s-app{min-height:100%}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWF0ZXJpYWxBcHAuc3ZlbHRlIiwibWFwcGluZ3MiOiJBQUlrRCxTQUFBLE9BQUEsQ0FBQSwrMWdMQU0wbm1NIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIk1hdGVyaWFsQXBwLnN2ZWx0ZSJdfQ== */");
}

function create_fragment$4(ctx) {
	let div;
	let div_class_value;
	let current;
	const default_slot_template = /*#slots*/ ctx[2].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

	const block = {
		c: function create() {
			div = element("div");
			if (default_slot) default_slot.c();
			attr_dev(div, "class", div_class_value = "s-app theme--" + /*theme*/ ctx[0]);
			add_location(div, file$4, 7449, 0, 243142);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[1],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
						null
					);
				}
			}

			if (!current || dirty & /*theme*/ 1 && div_class_value !== (div_class_value = "s-app theme--" + /*theme*/ ctx[0])) {
				attr_dev(div, "class", div_class_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$4.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$4($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('MaterialApp', slots, ['default']);
	let { theme = 'light' } = $$props;
	const writable_props = ['theme'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MaterialApp> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({ theme });

	$$self.$inject_state = $$props => {
		if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [theme, $$scope, slots];
}

class MaterialApp extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$4, create_fragment$4, safe_not_equal, { theme: 0 }, add_css$4);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "MaterialApp",
			options,
			id: create_fragment$4.name
		});
	}

	get theme() {
		throw new Error("<MaterialApp>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set theme(value) {
		throw new Error("<MaterialApp>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

function format$1(input) {
  if (typeof input === 'number') return `${input}px`;
  return input;
}

/**
 * @param node {Element}
 * @param styles {Object}
 */
var Style = (node, _styles) => {
  let styles = _styles;
  Object.entries(styles).forEach(([key, value]) => {
    if (value) node.style.setProperty(`--s-${key}`, format$1(value));
  });

  return {
    update(newStyles) {
      Object.entries(newStyles).forEach(([key, value]) => {
        if (value) {
          node.style.setProperty(`--s-${key}`, format$1(value));
          delete styles[key];
        }
      });

      Object.keys(styles).forEach((name) => node.style.removeProperty(`--s-${name}`));

      styles = newStyles;
    },
  };
};

/* node_modules/svelte-materialify/dist/components/Icon/Icon.svelte generated by Svelte v3.42.1 */
const file$3 = "node_modules/svelte-materialify/dist/components/Icon/Icon.svelte";

function add_css$3(target) {
	append_styles(target, "svelte-sls2ul", ".s-icon{color:var(--theme-icons-active);font-size:var(--s-icon-size);transform:rotate(var(--s-icon-rotate));line-height:1;letter-spacing:normal;text-transform:none;display:inline-flex;font-feature-settings:\"liga\";justify-content:center;position:relative;align-items:center;text-indent:0;vertical-align:middle;cursor:inherit;user-select:none;direction:ltr;transition:0.3s cubic-bezier(0.25, 0.8, 0.5, 1), visibility 0s}.s-icon.disabled{color:var(--theme-icons-inactive)}.s-icon.spin{animation:s-icon-spin 1s linear infinite}.s-icon>svg{fill:currentColor}@keyframes s-icon-spin{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSWNvbi5zdmVsdGUiLCJtYXBwaW5ncyI6IkFBc0IyQyxPQUFBLEFBQUEsQ0FBQSw4bUJBQW9xQiIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJJY29uLnN2ZWx0ZSJdfQ== */");
}

// (66:2) {#if path}
function create_if_block$1(ctx) {
	let svg;
	let path_1;
	let svg_viewBox_value;
	let if_block = /*label*/ ctx[10] && create_if_block_1(ctx);

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path_1 = svg_element("path");
			if (if_block) if_block.c();
			attr_dev(path_1, "d", /*path*/ ctx[9]);
			add_location(path_1, file$3, 71, 6, 1722);
			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*viewWidth*/ ctx[4] + " " + /*viewHeight*/ ctx[5]);
			add_location(svg, file$3, 66, 4, 1590);
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path_1);
			if (if_block) if_block.m(path_1, null);
		},
		p: function update(ctx, dirty) {
			if (/*label*/ ctx[10]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_1(ctx);
					if_block.c();
					if_block.m(path_1, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*path*/ 512) {
				attr_dev(path_1, "d", /*path*/ ctx[9]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewWidth, viewHeight*/ 48 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*viewWidth*/ ctx[4] + " " + /*viewHeight*/ ctx[5])) {
				attr_dev(svg, "viewBox", svg_viewBox_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$1.name,
		type: "if",
		source: "(66:2) {#if path}",
		ctx
	});

	return block;
}

// (73:8) {#if label}
function create_if_block_1(ctx) {
	let title;
	let t;

	const block = {
		c: function create() {
			title = svg_element("title");
			t = text(/*label*/ ctx[10]);
			add_location(title, file$3, 73, 10, 1770);
		},
		m: function mount(target, anchor) {
			insert_dev(target, title, anchor);
			append_dev(title, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*label*/ 1024) set_data_dev(t, /*label*/ ctx[10]);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(title);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(73:8) {#if label}",
		ctx
	});

	return block;
}

function create_fragment$3(ctx) {
	let i;
	let t;
	let i_class_value;
	let Style_action;
	let current;
	let mounted;
	let dispose;
	let if_block = /*path*/ ctx[9] && create_if_block$1(ctx);
	const default_slot_template = /*#slots*/ ctx[13].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

	const block = {
		c: function create() {
			i = element("i");
			if (if_block) if_block.c();
			t = space();
			if (default_slot) default_slot.c();
			attr_dev(i, "aria-hidden", "true");
			attr_dev(i, "class", i_class_value = "s-icon " + /*klass*/ ctx[2]);
			attr_dev(i, "aria-label", /*label*/ ctx[10]);
			attr_dev(i, "aria-disabled", /*disabled*/ ctx[8]);
			attr_dev(i, "style", /*style*/ ctx[11]);
			toggle_class(i, "spin", /*spin*/ ctx[7]);
			toggle_class(i, "disabled", /*disabled*/ ctx[8]);
			add_location(i, file$3, 56, 0, 1358);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, i, anchor);
			if (if_block) if_block.m(i, null);
			append_dev(i, t);

			if (default_slot) {
				default_slot.m(i, null);
			}

			current = true;

			if (!mounted) {
				dispose = action_destroyer(Style_action = Style.call(null, i, {
					'icon-size': /*size*/ ctx[3],
					'icon-rotate': `${/*rotate*/ ctx[6]}deg`
				}));

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (/*path*/ ctx[9]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$1(ctx);
					if_block.c();
					if_block.m(i, t);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[12],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
						null
					);
				}
			}

			if (!current || dirty & /*klass*/ 4 && i_class_value !== (i_class_value = "s-icon " + /*klass*/ ctx[2])) {
				attr_dev(i, "class", i_class_value);
			}

			if (!current || dirty & /*label*/ 1024) {
				attr_dev(i, "aria-label", /*label*/ ctx[10]);
			}

			if (!current || dirty & /*disabled*/ 256) {
				attr_dev(i, "aria-disabled", /*disabled*/ ctx[8]);
			}

			if (!current || dirty & /*style*/ 2048) {
				attr_dev(i, "style", /*style*/ ctx[11]);
			}

			if (Style_action && is_function(Style_action.update) && dirty & /*size, rotate*/ 72) Style_action.update.call(null, {
				'icon-size': /*size*/ ctx[3],
				'icon-rotate': `${/*rotate*/ ctx[6]}deg`
			});

			if (dirty & /*klass, spin*/ 132) {
				toggle_class(i, "spin", /*spin*/ ctx[7]);
			}

			if (dirty & /*klass, disabled*/ 260) {
				toggle_class(i, "disabled", /*disabled*/ ctx[8]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(i);
			if (if_block) if_block.d();
			if (default_slot) default_slot.d(detaching);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$3.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$3($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Icon', slots, ['default']);
	let { class: klass = '' } = $$props;
	let { size = '24px' } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { viewWidth = '24' } = $$props;
	let { viewHeight = '24' } = $$props;
	let { rotate = 0 } = $$props;
	let { spin = false } = $$props;
	let { disabled = false } = $$props;
	let { path = null } = $$props;
	let { label = null } = $$props;
	let { style = null } = $$props;

	const writable_props = [
		'class',
		'size',
		'width',
		'height',
		'viewWidth',
		'viewHeight',
		'rotate',
		'spin',
		'disabled',
		'path',
		'label',
		'style'
	];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Icon> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('class' in $$props) $$invalidate(2, klass = $$props.class);
		if ('size' in $$props) $$invalidate(3, size = $$props.size);
		if ('width' in $$props) $$invalidate(0, width = $$props.width);
		if ('height' in $$props) $$invalidate(1, height = $$props.height);
		if ('viewWidth' in $$props) $$invalidate(4, viewWidth = $$props.viewWidth);
		if ('viewHeight' in $$props) $$invalidate(5, viewHeight = $$props.viewHeight);
		if ('rotate' in $$props) $$invalidate(6, rotate = $$props.rotate);
		if ('spin' in $$props) $$invalidate(7, spin = $$props.spin);
		if ('disabled' in $$props) $$invalidate(8, disabled = $$props.disabled);
		if ('path' in $$props) $$invalidate(9, path = $$props.path);
		if ('label' in $$props) $$invalidate(10, label = $$props.label);
		if ('style' in $$props) $$invalidate(11, style = $$props.style);
		if ('$$scope' in $$props) $$invalidate(12, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({
		Style,
		klass,
		size,
		width,
		height,
		viewWidth,
		viewHeight,
		rotate,
		spin,
		disabled,
		path,
		label,
		style
	});

	$$self.$inject_state = $$props => {
		if ('klass' in $$props) $$invalidate(2, klass = $$props.klass);
		if ('size' in $$props) $$invalidate(3, size = $$props.size);
		if ('width' in $$props) $$invalidate(0, width = $$props.width);
		if ('height' in $$props) $$invalidate(1, height = $$props.height);
		if ('viewWidth' in $$props) $$invalidate(4, viewWidth = $$props.viewWidth);
		if ('viewHeight' in $$props) $$invalidate(5, viewHeight = $$props.viewHeight);
		if ('rotate' in $$props) $$invalidate(6, rotate = $$props.rotate);
		if ('spin' in $$props) $$invalidate(7, spin = $$props.spin);
		if ('disabled' in $$props) $$invalidate(8, disabled = $$props.disabled);
		if ('path' in $$props) $$invalidate(9, path = $$props.path);
		if ('label' in $$props) $$invalidate(10, label = $$props.label);
		if ('style' in $$props) $$invalidate(11, style = $$props.style);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*size*/ 8) {
			{
				$$invalidate(0, width = size);
				$$invalidate(1, height = size);
			}
		}
	};

	return [
		width,
		height,
		klass,
		size,
		viewWidth,
		viewHeight,
		rotate,
		spin,
		disabled,
		path,
		label,
		style,
		$$scope,
		slots
	];
}

class Icon extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(
			this,
			options,
			instance$3,
			create_fragment$3,
			safe_not_equal,
			{
				class: 2,
				size: 3,
				width: 0,
				height: 1,
				viewWidth: 4,
				viewHeight: 5,
				rotate: 6,
				spin: 7,
				disabled: 8,
				path: 9,
				label: 10,
				style: 11
			},
			add_css$3
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Icon",
			options,
			id: create_fragment$3.name
		});
	}

	get class() {
		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get size() {
		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewWidth() {
		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewWidth(value) {
		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewHeight() {
		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewHeight(value) {
		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get rotate() {
		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set rotate(value) {
		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get spin() {
		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set spin(value) {
		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get disabled() {
		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set disabled(value) {
		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get path() {
		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set path(value) {
		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get label() {
		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set label(value) {
		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get style() {
		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set style(value) {
		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

const filter = (classes) => classes.filter((x) => !!x);
const format = (classes) => classes.split(' ').filter((x) => !!x);

/**
 * @param node {Element}
 * @param classes {Array<string>}
 */
var Class = (node, _classes) => {
  let classes = _classes;
  node.classList.add(...format(filter(classes).join(' ')));
  return {
    update(_newClasses) {
      const newClasses = _newClasses;
      newClasses.forEach((klass, i) => {
        if (klass) node.classList.add(...format(klass));
        else if (classes[i]) node.classList.remove(...format(classes[i]));
      });
      classes = newClasses;
    },
  };
};

/* node_modules/svelte-materialify/dist/components/Button/Button.svelte generated by Svelte v3.42.1 */
const file$2 = "node_modules/svelte-materialify/dist/components/Button/Button.svelte";

function add_css$2(target) {
	append_styles(target, "svelte-3647tl", ".s-btn{align-items:center;border-radius:4px;display:inline-flex;flex:0 0 auto;overflow:hidden;position:relative;outline:0;justify-content:center;user-select:none;vertical-align:middle;white-space:nowrap;text-decoration:none;transition-duration:.28s;transition-property:box-shadow,transform,opacity;background-color:var(--theme-app-bar);box-shadow:0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)}.s-btn .s-icon,.s-btn a{color:inherit}.s-btn .s-btn__content{display:flex;align-items:center;flex:1 0 auto;color:inherit;justify-content:inherit;line-height:normal;position:relative;font-size:inherit;font-weight:500;letter-spacing:.0892857143em;text-transform:uppercase}.s-btn:before{border-radius:inherit;bottom:0;color:inherit;content:\"\";left:0;opacity:0;pointer-events:none;position:absolute;right:0;top:0;transition:opacity 0.2s cubic-bezier(0.4, 0, 0.6, 1);background-color:currentColor}.s-btn.size-x-small{font-size:.625rem}.s-btn.size-small{font-size:.75rem}.s-btn.size-default,.s-btn.size-large{font-size:.875rem}.s-btn.size-x-large{font-size:1rem}.s-btn:not(.disabled):hover:before{opacity:.08}.s-btn:not(.disabled).active:before{opacity:.18}.s-btn:not(.disabled).focus-visible:before{opacity:.24}.s-btn:not(.outlined).error-color,.s-btn:not(.outlined).info-color,.s-btn:not(.outlined).primary-color,.s-btn:not(.outlined).secondary-color,.s-btn:not(.outlined).success-color,.s-btn:not(.outlined).warning-color{color:#fff}.s-btn:not(.icon):not(.s-btn--fab).size-x-small{height:20px;min-width:36px;padding:0 8.8888888889px}.s-btn:not(.icon):not(.s-btn--fab).size-small{height:28px;min-width:50px;padding:0 12.4444444444px}.s-btn:not(.icon):not(.s-btn--fab).size-default{height:36px;min-width:64px;padding:0 16px}.s-btn:not(.icon):not(.s-btn--fab).size-large{height:44px;min-width:78px;padding:0 19.5555555556px}.s-btn:not(.icon):not(.s-btn--fab).size-x-large{height:52px;min-width:92px;padding:0 23.1111111111px}.s-btn:not(.disabled):not(.depressed){will-change:box-shadow}.s-btn.block{display:flex;flex:1 0 auto;min-width:100% !important;max-width:auto}.s-btn.tile{border-radius:0}.s-btn.text{background-color:transparent}.s-btn.depressed{box-shadow:none}.s-btn.outlined{border:1px solid;background-color:transparent !important}.s-btn.rounded{border-radius:9999px}.s-btn.disabled{pointer-events:none;color:var(--theme-buttons-disabled)}.s-btn.disabled:not(.flat):not(.text):not(.outlined){background-color:var(--theme-buttons-disabled)}.s-btn.icon.size-x-small{height:20px;width:20px}.s-btn.icon.size-small{height:28px;width:28px}.s-btn.icon.size-default{height:36px;width:36px}.s-btn.icon.size-large{height:44px;width:44px}.s-btn.icon.size-x-large{height:52px;width:52px}.s-btn.icon,.s-btn.s-btn--fab{border-radius:50%;min-width:0;min-height:0;padding:0}.s-btn.icon.size-x-small .s-icon,.s-btn.s-btn--fab.size-x-small .s-icon{font-size:18px}.s-btn.icon.size-default .s-icon,.s-btn.icon.size-small .s-icon,.s-btn.s-btn--fab.size-default .s-icon,.s-btn.s-btn--fab.size-small .s-icon{font-size:24px}.s-btn.icon.size-large .s-icon,.s-btn.s-btn--fab.size-large .s-icon{font-size:28px}.s-btn.icon.size-x-large .s-icon,.s-btn.s-btn--fab.size-x-large .s-icon{font-size:32px}.s-btn.s-btn--fab.size-x-small{height:32px;width:32px}.s-btn.s-btn--fab.size-small{height:40px;width:40px}.s-btn.s-btn--fab.size-default{height:56px;width:56px}.s-btn.s-btn--fab.size-large{height:64px;width:64px}.s-btn.s-btn--fab.size-x-large{height:72px;width:72px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnV0dG9uLnN2ZWx0ZSIsIm1hcHBpbmdzIjoiQUF3QjZDLE1BQUEsQUFBQSxDQUFBLHk1R0FBKytIIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkJ1dHRvbi5zdmVsdGUiXX0= */");
}

function create_fragment$2(ctx) {
	let button_1;
	let span;
	let button_1_class_value;
	let Class_action;
	let Ripple_action;
	let current;
	let mounted;
	let dispose;
	const default_slot_template = /*#slots*/ ctx[19].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

	let button_1_levels = [
		{
			class: button_1_class_value = "s-btn size-" + /*size*/ ctx[5] + " " + /*klass*/ ctx[1]
		},
		{ type: /*type*/ ctx[14] },
		{ style: /*style*/ ctx[16] },
		{ disabled: /*disabled*/ ctx[11] },
		{ "aria-disabled": /*disabled*/ ctx[11] },
		/*$$restProps*/ ctx[17]
	];

	let button_1_data = {};

	for (let i = 0; i < button_1_levels.length; i += 1) {
		button_1_data = assign(button_1_data, button_1_levels[i]);
	}

	const block_1 = {
		c: function create() {
			button_1 = element("button");
			span = element("span");
			if (default_slot) default_slot.c();
			attr_dev(span, "class", "s-btn__content");
			add_location(span, file$2, 231, 2, 5892);
			set_attributes(button_1, button_1_data);
			toggle_class(button_1, "s-btn--fab", /*fab*/ ctx[2]);
			toggle_class(button_1, "icon", /*icon*/ ctx[3]);
			toggle_class(button_1, "block", /*block*/ ctx[4]);
			toggle_class(button_1, "tile", /*tile*/ ctx[6]);
			toggle_class(button_1, "text", /*text*/ ctx[7] || /*icon*/ ctx[3]);
			toggle_class(button_1, "depressed", /*depressed*/ ctx[8] || /*text*/ ctx[7] || /*disabled*/ ctx[11] || /*outlined*/ ctx[9] || /*icon*/ ctx[3]);
			toggle_class(button_1, "outlined", /*outlined*/ ctx[9]);
			toggle_class(button_1, "rounded", /*rounded*/ ctx[10]);
			toggle_class(button_1, "disabled", /*disabled*/ ctx[11]);
			add_location(button_1, file$2, 211, 0, 5442);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, button_1, anchor);
			append_dev(button_1, span);

			if (default_slot) {
				default_slot.m(span, null);
			}

			if (button_1.autofocus) button_1.focus();
			/*button_1_binding*/ ctx[21](button_1);
			current = true;

			if (!mounted) {
				dispose = [
					action_destroyer(Class_action = Class.call(null, button_1, [/*active*/ ctx[12] && /*activeClass*/ ctx[13]])),
					action_destroyer(Ripple_action = Ripple.call(null, button_1, /*ripple*/ ctx[15])),
					listen_dev(button_1, "click", /*click_handler*/ ctx[20], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[18],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
						null
					);
				}
			}

			set_attributes(button_1, button_1_data = get_spread_update(button_1_levels, [
				(!current || dirty & /*size, klass*/ 34 && button_1_class_value !== (button_1_class_value = "s-btn size-" + /*size*/ ctx[5] + " " + /*klass*/ ctx[1])) && { class: button_1_class_value },
				(!current || dirty & /*type*/ 16384) && { type: /*type*/ ctx[14] },
				(!current || dirty & /*style*/ 65536) && { style: /*style*/ ctx[16] },
				(!current || dirty & /*disabled*/ 2048) && { disabled: /*disabled*/ ctx[11] },
				(!current || dirty & /*disabled*/ 2048) && { "aria-disabled": /*disabled*/ ctx[11] },
				dirty & /*$$restProps*/ 131072 && /*$$restProps*/ ctx[17]
			]));

			if (Class_action && is_function(Class_action.update) && dirty & /*active, activeClass*/ 12288) Class_action.update.call(null, [/*active*/ ctx[12] && /*activeClass*/ ctx[13]]);
			if (Ripple_action && is_function(Ripple_action.update) && dirty & /*ripple*/ 32768) Ripple_action.update.call(null, /*ripple*/ ctx[15]);
			toggle_class(button_1, "s-btn--fab", /*fab*/ ctx[2]);
			toggle_class(button_1, "icon", /*icon*/ ctx[3]);
			toggle_class(button_1, "block", /*block*/ ctx[4]);
			toggle_class(button_1, "tile", /*tile*/ ctx[6]);
			toggle_class(button_1, "text", /*text*/ ctx[7] || /*icon*/ ctx[3]);
			toggle_class(button_1, "depressed", /*depressed*/ ctx[8] || /*text*/ ctx[7] || /*disabled*/ ctx[11] || /*outlined*/ ctx[9] || /*icon*/ ctx[3]);
			toggle_class(button_1, "outlined", /*outlined*/ ctx[9]);
			toggle_class(button_1, "rounded", /*rounded*/ ctx[10]);
			toggle_class(button_1, "disabled", /*disabled*/ ctx[11]);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(button_1);
			if (default_slot) default_slot.d(detaching);
			/*button_1_binding*/ ctx[21](null);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block: block_1,
		id: create_fragment$2.name,
		type: "component",
		source: "",
		ctx
	});

	return block_1;
}

function instance$2($$self, $$props, $$invalidate) {
	const omit_props_names = [
		"class","fab","icon","block","size","tile","text","depressed","outlined","rounded","disabled","active","activeClass","type","ripple","style","button"
	];

	let $$restProps = compute_rest_props($$props, omit_props_names);
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Button', slots, ['default']);
	let { class: klass = '' } = $$props;
	let { fab = false } = $$props;
	let { icon = false } = $$props;
	let { block = false } = $$props;
	let { size = 'default' } = $$props;
	let { tile = false } = $$props;
	let { text = false } = $$props;
	let { depressed = false } = $$props;
	let { outlined = false } = $$props;
	let { rounded = false } = $$props;
	let { disabled = null } = $$props;
	let { active = false } = $$props;
	let { activeClass = 'active' } = $$props;
	let { type = 'button' } = $$props;
	let { ripple = {} } = $$props;
	let { style = null } = $$props;
	let { button = null } = $$props;

	function click_handler(event) {
		bubble.call(this, $$self, event);
	}

	function button_1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			button = $$value;
			$$invalidate(0, button);
		});
	}

	$$self.$$set = $$new_props => {
		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
		$$invalidate(17, $$restProps = compute_rest_props($$props, omit_props_names));
		if ('class' in $$new_props) $$invalidate(1, klass = $$new_props.class);
		if ('fab' in $$new_props) $$invalidate(2, fab = $$new_props.fab);
		if ('icon' in $$new_props) $$invalidate(3, icon = $$new_props.icon);
		if ('block' in $$new_props) $$invalidate(4, block = $$new_props.block);
		if ('size' in $$new_props) $$invalidate(5, size = $$new_props.size);
		if ('tile' in $$new_props) $$invalidate(6, tile = $$new_props.tile);
		if ('text' in $$new_props) $$invalidate(7, text = $$new_props.text);
		if ('depressed' in $$new_props) $$invalidate(8, depressed = $$new_props.depressed);
		if ('outlined' in $$new_props) $$invalidate(9, outlined = $$new_props.outlined);
		if ('rounded' in $$new_props) $$invalidate(10, rounded = $$new_props.rounded);
		if ('disabled' in $$new_props) $$invalidate(11, disabled = $$new_props.disabled);
		if ('active' in $$new_props) $$invalidate(12, active = $$new_props.active);
		if ('activeClass' in $$new_props) $$invalidate(13, activeClass = $$new_props.activeClass);
		if ('type' in $$new_props) $$invalidate(14, type = $$new_props.type);
		if ('ripple' in $$new_props) $$invalidate(15, ripple = $$new_props.ripple);
		if ('style' in $$new_props) $$invalidate(16, style = $$new_props.style);
		if ('button' in $$new_props) $$invalidate(0, button = $$new_props.button);
		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => ({
		Ripple,
		Class,
		klass,
		fab,
		icon,
		block,
		size,
		tile,
		text,
		depressed,
		outlined,
		rounded,
		disabled,
		active,
		activeClass,
		type,
		ripple,
		style,
		button
	});

	$$self.$inject_state = $$new_props => {
		if ('klass' in $$props) $$invalidate(1, klass = $$new_props.klass);
		if ('fab' in $$props) $$invalidate(2, fab = $$new_props.fab);
		if ('icon' in $$props) $$invalidate(3, icon = $$new_props.icon);
		if ('block' in $$props) $$invalidate(4, block = $$new_props.block);
		if ('size' in $$props) $$invalidate(5, size = $$new_props.size);
		if ('tile' in $$props) $$invalidate(6, tile = $$new_props.tile);
		if ('text' in $$props) $$invalidate(7, text = $$new_props.text);
		if ('depressed' in $$props) $$invalidate(8, depressed = $$new_props.depressed);
		if ('outlined' in $$props) $$invalidate(9, outlined = $$new_props.outlined);
		if ('rounded' in $$props) $$invalidate(10, rounded = $$new_props.rounded);
		if ('disabled' in $$props) $$invalidate(11, disabled = $$new_props.disabled);
		if ('active' in $$props) $$invalidate(12, active = $$new_props.active);
		if ('activeClass' in $$props) $$invalidate(13, activeClass = $$new_props.activeClass);
		if ('type' in $$props) $$invalidate(14, type = $$new_props.type);
		if ('ripple' in $$props) $$invalidate(15, ripple = $$new_props.ripple);
		if ('style' in $$props) $$invalidate(16, style = $$new_props.style);
		if ('button' in $$props) $$invalidate(0, button = $$new_props.button);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		button,
		klass,
		fab,
		icon,
		block,
		size,
		tile,
		text,
		depressed,
		outlined,
		rounded,
		disabled,
		active,
		activeClass,
		type,
		ripple,
		style,
		$$restProps,
		$$scope,
		slots,
		click_handler,
		button_1_binding
	];
}

class Button extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(
			this,
			options,
			instance$2,
			create_fragment$2,
			safe_not_equal,
			{
				class: 1,
				fab: 2,
				icon: 3,
				block: 4,
				size: 5,
				tile: 6,
				text: 7,
				depressed: 8,
				outlined: 9,
				rounded: 10,
				disabled: 11,
				active: 12,
				activeClass: 13,
				type: 14,
				ripple: 15,
				style: 16,
				button: 0
			},
			add_css$2
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Button",
			options,
			id: create_fragment$2.name
		});
	}

	get class() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get fab() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set fab(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get icon() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set icon(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get block() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set block(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get size() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get tile() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set tile(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get text() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set text(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get depressed() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set depressed(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get outlined() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set outlined(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get rounded() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set rounded(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get disabled() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set disabled(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get active() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set active(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get activeClass() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set activeClass(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get type() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set type(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get ripple() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set ripple(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get style() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set style(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get button() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set button(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* eslint-disable */
// Shamefully ripped from https://github.com/lukeed/uid
let IDX = 36;
let HEX = '';
while (IDX--) HEX += IDX.toString(36);

var uid = (len) => {
  let str = '';
  let num = len || 11;
  while (num--) str += HEX[(Math.random() * 36) | 0];
  return str;
};

/* node_modules/svelte-materialify/dist/components/AppBar/AppBar.svelte generated by Svelte v3.42.1 */
const file$1 = "node_modules/svelte-materialify/dist/components/AppBar/AppBar.svelte";

function add_css$1(target) {
	append_styles(target, "svelte-1layc3d", ".s-app-bar{background-color:var(--theme-app-bar);contain:layout;display:block;flex:1 1 auto;max-width:100%;position:relative;z-index:5;transition:0.25s cubic-bezier(0.4, 0, 0.2, 1)}.s-app-bar .s-app-bar__wrapper{height:var(--s-app-bar-height);align-items:center;display:flex;padding:4px}.s-app-bar .s-app-bar__wrapper .s-btn.fab{width:48px;height:48px}.s-app-bar .s-app-bar__title{padding-left:16px;font-size:1.25rem;line-height:1.5;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.s-app-bar:not(.tile){border-top-left-radius:inherit;border-top-right-radius:inherit}.s-app-bar:not(.flat){box-shadow:0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12)}.s-app-bar.dense .s-app-bar__wrapper{height:48px;padding:0}.s-app-bar.prominent .s-app-bar__wrapper{height:128px;align-items:flex-start}.s-app-bar.prominent .s-app-bar__title{align-self:flex-end;padding-bottom:6px;padding-top:0}.s-app-bar.fixed{position:fixed;top:0}.s-app-bar.absolute{position:absolute;top:0}.s-app-bar.hidden{transform:translate(-100%)}.s-app-bar.collapsed{border-bottom-right-radius:24px;max-width:112px;overflow:hidden}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwQmFyLnN2ZWx0ZSIsIm1hcHBpbmdzIjoiQUFnQjZDLFVBQUEsQUFBQSxDQUFBLG1uQ0FBK3hDIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkFwcEJhci5zdmVsdGUiXX0= */");
}

const get_extension_slot_changes = dirty => ({});
const get_extension_slot_context = ctx => ({});
const get_title_slot_changes = dirty => ({});
const get_title_slot_context = ctx => ({});
const get_icon_slot_changes = dirty => ({});
const get_icon_slot_context = ctx => ({});

// (94:4) {#if !collapsed}
function create_if_block(ctx) {
	let div;
	let current;
	const title_slot_template = /*#slots*/ ctx[11].title;
	const title_slot = create_slot(title_slot_template, ctx, /*$$scope*/ ctx[10], get_title_slot_context);

	const block = {
		c: function create() {
			div = element("div");
			if (title_slot) title_slot.c();
			attr_dev(div, "class", "s-app-bar__title");
			add_location(div, file$1, 94, 6, 2257);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (title_slot) {
				title_slot.m(div, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (title_slot) {
				if (title_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
					update_slot_base(
						title_slot,
						title_slot_template,
						ctx,
						/*$$scope*/ ctx[10],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
						: get_slot_changes(title_slot_template, /*$$scope*/ ctx[10], dirty, get_title_slot_changes),
						get_title_slot_context
					);
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(title_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(title_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (title_slot) title_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(94:4) {#if !collapsed}",
		ctx
	});

	return block;
}

function create_fragment$1(ctx) {
	let header;
	let div;
	let t0;
	let t1;
	let t2;
	let header_class_value;
	let Style_action;
	let current;
	let mounted;
	let dispose;
	const icon_slot_template = /*#slots*/ ctx[11].icon;
	const icon_slot = create_slot(icon_slot_template, ctx, /*$$scope*/ ctx[10], get_icon_slot_context);
	let if_block = !/*collapsed*/ ctx[8] && create_if_block(ctx);
	const default_slot_template = /*#slots*/ ctx[11].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
	const extension_slot_template = /*#slots*/ ctx[11].extension;
	const extension_slot = create_slot(extension_slot_template, ctx, /*$$scope*/ ctx[10], get_extension_slot_context);

	const block = {
		c: function create() {
			header = element("header");
			div = element("div");
			if (icon_slot) icon_slot.c();
			t0 = space();
			if (if_block) if_block.c();
			t1 = space();
			if (default_slot) default_slot.c();
			t2 = space();
			if (extension_slot) extension_slot.c();
			attr_dev(div, "class", "s-app-bar__wrapper");
			add_location(div, file$1, 91, 2, 2172);
			attr_dev(header, "class", header_class_value = "s-app-bar " + /*klass*/ ctx[0]);
			attr_dev(header, "style", /*style*/ ctx[9]);
			toggle_class(header, "tile", /*tile*/ ctx[2]);
			toggle_class(header, "flat", /*flat*/ ctx[3]);
			toggle_class(header, "dense", /*dense*/ ctx[4]);
			toggle_class(header, "prominent", /*prominent*/ ctx[5]);
			toggle_class(header, "fixed", /*fixed*/ ctx[6]);
			toggle_class(header, "absolute", /*absolute*/ ctx[7]);
			toggle_class(header, "collapsed", /*collapsed*/ ctx[8]);
			add_location(header, file$1, 80, 0, 1973);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, header, anchor);
			append_dev(header, div);

			if (icon_slot) {
				icon_slot.m(div, null);
			}

			append_dev(div, t0);
			if (if_block) if_block.m(div, null);
			append_dev(div, t1);

			if (default_slot) {
				default_slot.m(div, null);
			}

			append_dev(header, t2);

			if (extension_slot) {
				extension_slot.m(header, null);
			}

			current = true;

			if (!mounted) {
				dispose = action_destroyer(Style_action = Style.call(null, header, { 'app-bar-height': /*height*/ ctx[1] }));
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (icon_slot) {
				if (icon_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
					update_slot_base(
						icon_slot,
						icon_slot_template,
						ctx,
						/*$$scope*/ ctx[10],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
						: get_slot_changes(icon_slot_template, /*$$scope*/ ctx[10], dirty, get_icon_slot_changes),
						get_icon_slot_context
					);
				}
			}

			if (!/*collapsed*/ ctx[8]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*collapsed*/ 256) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(div, t1);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}

			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[10],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
						null
					);
				}
			}

			if (extension_slot) {
				if (extension_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
					update_slot_base(
						extension_slot,
						extension_slot_template,
						ctx,
						/*$$scope*/ ctx[10],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
						: get_slot_changes(extension_slot_template, /*$$scope*/ ctx[10], dirty, get_extension_slot_changes),
						get_extension_slot_context
					);
				}
			}

			if (!current || dirty & /*klass*/ 1 && header_class_value !== (header_class_value = "s-app-bar " + /*klass*/ ctx[0])) {
				attr_dev(header, "class", header_class_value);
			}

			if (!current || dirty & /*style*/ 512) {
				attr_dev(header, "style", /*style*/ ctx[9]);
			}

			if (Style_action && is_function(Style_action.update) && dirty & /*height*/ 2) Style_action.update.call(null, { 'app-bar-height': /*height*/ ctx[1] });

			if (dirty & /*klass, tile*/ 5) {
				toggle_class(header, "tile", /*tile*/ ctx[2]);
			}

			if (dirty & /*klass, flat*/ 9) {
				toggle_class(header, "flat", /*flat*/ ctx[3]);
			}

			if (dirty & /*klass, dense*/ 17) {
				toggle_class(header, "dense", /*dense*/ ctx[4]);
			}

			if (dirty & /*klass, prominent*/ 33) {
				toggle_class(header, "prominent", /*prominent*/ ctx[5]);
			}

			if (dirty & /*klass, fixed*/ 65) {
				toggle_class(header, "fixed", /*fixed*/ ctx[6]);
			}

			if (dirty & /*klass, absolute*/ 129) {
				toggle_class(header, "absolute", /*absolute*/ ctx[7]);
			}

			if (dirty & /*klass, collapsed*/ 257) {
				toggle_class(header, "collapsed", /*collapsed*/ ctx[8]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(icon_slot, local);
			transition_in(if_block);
			transition_in(default_slot, local);
			transition_in(extension_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(icon_slot, local);
			transition_out(if_block);
			transition_out(default_slot, local);
			transition_out(extension_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(header);
			if (icon_slot) icon_slot.d(detaching);
			if (if_block) if_block.d();
			if (default_slot) default_slot.d(detaching);
			if (extension_slot) extension_slot.d(detaching);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$1.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$1($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('AppBar', slots, ['icon','title','default','extension']);
	let { class: klass = '' } = $$props;
	let { height = '56px' } = $$props;
	let { tile = false } = $$props;
	let { flat = false } = $$props;
	let { dense = false } = $$props;
	let { prominent = false } = $$props;
	let { fixed = false } = $$props;
	let { absolute = false } = $$props;
	let { collapsed = false } = $$props;
	let { style = '' } = $$props;

	const writable_props = [
		'class',
		'height',
		'tile',
		'flat',
		'dense',
		'prominent',
		'fixed',
		'absolute',
		'collapsed',
		'style'
	];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AppBar> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('class' in $$props) $$invalidate(0, klass = $$props.class);
		if ('height' in $$props) $$invalidate(1, height = $$props.height);
		if ('tile' in $$props) $$invalidate(2, tile = $$props.tile);
		if ('flat' in $$props) $$invalidate(3, flat = $$props.flat);
		if ('dense' in $$props) $$invalidate(4, dense = $$props.dense);
		if ('prominent' in $$props) $$invalidate(5, prominent = $$props.prominent);
		if ('fixed' in $$props) $$invalidate(6, fixed = $$props.fixed);
		if ('absolute' in $$props) $$invalidate(7, absolute = $$props.absolute);
		if ('collapsed' in $$props) $$invalidate(8, collapsed = $$props.collapsed);
		if ('style' in $$props) $$invalidate(9, style = $$props.style);
		if ('$$scope' in $$props) $$invalidate(10, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({
		Style,
		klass,
		height,
		tile,
		flat,
		dense,
		prominent,
		fixed,
		absolute,
		collapsed,
		style
	});

	$$self.$inject_state = $$props => {
		if ('klass' in $$props) $$invalidate(0, klass = $$props.klass);
		if ('height' in $$props) $$invalidate(1, height = $$props.height);
		if ('tile' in $$props) $$invalidate(2, tile = $$props.tile);
		if ('flat' in $$props) $$invalidate(3, flat = $$props.flat);
		if ('dense' in $$props) $$invalidate(4, dense = $$props.dense);
		if ('prominent' in $$props) $$invalidate(5, prominent = $$props.prominent);
		if ('fixed' in $$props) $$invalidate(6, fixed = $$props.fixed);
		if ('absolute' in $$props) $$invalidate(7, absolute = $$props.absolute);
		if ('collapsed' in $$props) $$invalidate(8, collapsed = $$props.collapsed);
		if ('style' in $$props) $$invalidate(9, style = $$props.style);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		klass,
		height,
		tile,
		flat,
		dense,
		prominent,
		fixed,
		absolute,
		collapsed,
		style,
		$$scope,
		slots
	];
}

class AppBar extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(
			this,
			options,
			instance$1,
			create_fragment$1,
			safe_not_equal,
			{
				class: 0,
				height: 1,
				tile: 2,
				flat: 3,
				dense: 4,
				prominent: 5,
				fixed: 6,
				absolute: 7,
				collapsed: 8,
				style: 9
			},
			add_css$1
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "AppBar",
			options,
			id: create_fragment$1.name
		});
	}

	get class() {
		throw new Error("<AppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<AppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<AppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<AppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get tile() {
		throw new Error("<AppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set tile(value) {
		throw new Error("<AppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get flat() {
		throw new Error("<AppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set flat(value) {
		throw new Error("<AppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get dense() {
		throw new Error("<AppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set dense(value) {
		throw new Error("<AppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get prominent() {
		throw new Error("<AppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set prominent(value) {
		throw new Error("<AppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get fixed() {
		throw new Error("<AppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set fixed(value) {
		throw new Error("<AppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get absolute() {
		throw new Error("<AppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set absolute(value) {
		throw new Error("<AppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get collapsed() {
		throw new Error("<AppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set collapsed(value) {
		throw new Error("<AppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get style() {
		throw new Error("<AppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set style(value) {
		throw new Error("<AppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

// Material Design Icons v5.9.55
var mdiArrowLeftBoldCircle = "M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M7,12L12,17V14H16V10H12V7L7,12Z";
var mdiArrowRightBoldCircle = "M2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12M17,12L12,7V10H8V14H12V17L17,12Z";
var mdiHome = "M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z";
var mdiRefresh = "M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z";

/* src/components/Header.svelte generated by Svelte v3.42.1 */
const file = "src/components/Header.svelte";

function add_css(target) {
	append_styles(target, "svelte-p1j6eg", "select.svelte-p1j6eg{-webkit-appearance:button;-moz-appearance:button;-webkit-user-select:none;-moz-user-select:none;-webkit-padding-end:20px;-moz-padding-end:20px;-webkit-padding-start:2px;-moz-padding-start:2px;background-position:center right;background-repeat:no-repeat;border:1px solid #AAA;border-radius:2px;box-shadow:0px 1px 3px rgba(0, 0, 0, 0.1);font-size:inherit;margin-right:2%;overflow:hidden;padding-top:2px;padding-bottom:2px;text-overflow:ellipsis;white-space:nowrap;height:100%}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVhZGVyLnN2ZWx0ZSIsIm1hcHBpbmdzIjoiK2VBMERBIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkhlYWRlci5zdmVsdGUiXX0= */");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[5] = list[i];
	return child_ctx;
}

// (20:2) <Button text rounded onclick="window.location.href='/'">
function create_default_slot_4(ctx) {
	let icon;
	let t;
	let current;
	icon = new Icon({ props: { path: mdiHome }, $$inline: true });

	const block = {
		c: function create() {
			create_component(icon.$$.fragment);
			t = text(" streamchaser");
		},
		m: function mount(target, anchor) {
			mount_component(icon, target, anchor);
			insert_dev(target, t, anchor);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(icon.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(icon.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(icon, detaching);
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_4.name,
		type: "slot",
		source: "(20:2) <Button text rounded onclick=\\\"window.location.href='/'\\\">",
		ctx
	});

	return block;
}

// (24:2) <Button on:click={$goto('/about')} text rounded style="margin-right: 3%">
function create_default_slot_3(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("About Us");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_3.name,
		type: "slot",
		source: "(24:2) <Button on:click={$goto('/about')} text rounded style=\\\"margin-right: 3%\\\">",
		ctx
	});

	return block;
}

// (25:2) <Button on:click={$goto('/faq')} text rounded style="margin-right: 3%">
function create_default_slot_2(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("FAQ");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_2.name,
		type: "slot",
		source: "(25:2) <Button on:click={$goto('/faq')} text rounded style=\\\"margin-right: 3%\\\">",
		ctx
	});

	return block;
}

// (28:1) {#each countries as country}
function create_each_block(ctx) {
	let option;
	let t_value = /*country*/ ctx[5].name + "";
	let t;

	const block = {
		c: function create() {
			option = element("option");
			t = text(t_value);
			option.__value = /*country*/ ctx[5].value;
			option.value = option.__value;
			add_location(option, file, 28, 2, 971);
		},
		m: function mount(target, anchor) {
			insert_dev(target, option, anchor);
			append_dev(option, t);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(option);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(28:1) {#each countries as country}",
		ctx
	});

	return block;
}

// (19:0) <AppBar flat>
function create_default_slot_1(ctx) {
	let button0;
	let t0;
	let div;
	let t1;
	let button1;
	let t2;
	let button2;
	let t3;
	let select;
	let current;
	let mounted;
	let dispose;

	button0 = new Button({
			props: {
				text: true,
				rounded: true,
				onclick: "window.location.href='/'",
				$$slots: { default: [create_default_slot_4] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	button1 = new Button({
			props: {
				text: true,
				rounded: true,
				style: "margin-right: 3%",
				$$slots: { default: [create_default_slot_3] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	button1.$on("click", function () {
		if (is_function(/*$goto*/ ctx[1]('/about'))) /*$goto*/ ctx[1]('/about').apply(this, arguments);
	});

	button2 = new Button({
			props: {
				text: true,
				rounded: true,
				style: "margin-right: 3%",
				$$slots: { default: [create_default_slot_2] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	button2.$on("click", function () {
		if (is_function(/*$goto*/ ctx[1]('/faq'))) /*$goto*/ ctx[1]('/faq').apply(this, arguments);
	});

	let each_value = /*countries*/ ctx[2];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			create_component(button0.$$.fragment);
			t0 = space();
			div = element("div");
			t1 = space();
			create_component(button1.$$.fragment);
			t2 = space();
			create_component(button2.$$.fragment);
			t3 = space();
			select = element("select");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			set_style(div, "flex-grow", "1");
			add_location(div, file, 22, 2, 661);
			attr_dev(select, "class", "svelte-p1j6eg");
			if (/*value*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[3].call(select));
			add_location(select, file, 26, 2, 879);
		},
		m: function mount(target, anchor) {
			mount_component(button0, target, anchor);
			insert_dev(target, t0, anchor);
			insert_dev(target, div, anchor);
			insert_dev(target, t1, anchor);
			mount_component(button1, target, anchor);
			insert_dev(target, t2, anchor);
			mount_component(button2, target, anchor);
			insert_dev(target, t3, anchor);
			insert_dev(target, select, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(select, null);
			}

			select_option(select, /*value*/ ctx[0]);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(select, "change", /*select_change_handler*/ ctx[3]),
					listen_dev(
						select,
						"change",
						function () {
							if (is_function(currentCountry.set(/*value*/ ctx[0]))) currentCountry.set(/*value*/ ctx[0]).apply(this, arguments);
						},
						false,
						false,
						false
					)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			const button0_changes = {};

			if (dirty & /*$$scope*/ 256) {
				button0_changes.$$scope = { dirty, ctx };
			}

			button0.$set(button0_changes);
			const button1_changes = {};

			if (dirty & /*$$scope*/ 256) {
				button1_changes.$$scope = { dirty, ctx };
			}

			button1.$set(button1_changes);
			const button2_changes = {};

			if (dirty & /*$$scope*/ 256) {
				button2_changes.$$scope = { dirty, ctx };
			}

			button2.$set(button2_changes);

			if (dirty & /*countries*/ 4) {
				each_value = /*countries*/ ctx[2];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(select, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*value, countries*/ 5) {
				select_option(select, /*value*/ ctx[0]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(button0.$$.fragment, local);
			transition_in(button1.$$.fragment, local);
			transition_in(button2.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(button0.$$.fragment, local);
			transition_out(button1.$$.fragment, local);
			transition_out(button2.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(button0, detaching);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(div);
			if (detaching) detach_dev(t1);
			destroy_component(button1, detaching);
			if (detaching) detach_dev(t2);
			destroy_component(button2, detaching);
			if (detaching) detach_dev(t3);
			if (detaching) detach_dev(select);
			destroy_each(each_blocks, detaching);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1.name,
		type: "slot",
		source: "(19:0) <AppBar flat>",
		ctx
	});

	return block;
}

// (18:0) <MaterialApp>
function create_default_slot(ctx) {
	let appbar;
	let current;

	appbar = new AppBar({
			props: {
				flat: true,
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(appbar.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(appbar, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const appbar_changes = {};

			if (dirty & /*$$scope, value, $goto*/ 259) {
				appbar_changes.$$scope = { dirty, ctx };
			}

			appbar.$set(appbar_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(appbar.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(appbar.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(appbar, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(18:0) <MaterialApp>",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let materialapp;
	let current;

	materialapp = new MaterialApp({
			props: {
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(materialapp.$$.fragment);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(materialapp, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const materialapp_changes = {};

			if (dirty & /*$$scope, value, $goto*/ 259) {
				materialapp_changes.$$scope = { dirty, ctx };
			}

			materialapp.$set(materialapp_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(materialapp.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(materialapp.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(materialapp, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance($$self, $$props, $$invalidate) {
	let $currentCountry;
	let $goto;
	validate_store(currentCountry, 'currentCountry');
	component_subscribe($$self, currentCountry, $$value => $$invalidate(4, $currentCountry = $$value));
	validate_store(goto, 'goto');
	component_subscribe($$self, goto, $$value => $$invalidate(1, $goto = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Header', slots, []);
	let value = $currentCountry;

	const countries = [
		{ name: 'Denmark', value: 'DK' },
		{ name: 'Germany', value: 'DE' },
		{ name: 'Sweden', value: 'SE' },
		{ name: 'UK', value: 'GB' },
		{ name: 'USA', value: 'US' }
	];

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
	});

	function select_change_handler() {
		value = select_value(this);
		$$invalidate(0, value);
		$$invalidate(2, countries);
	}

	$$self.$capture_state = () => ({
		mdiHome,
		AppBar,
		Button,
		Icon,
		MaterialApp,
		goto,
		currentCountry,
		value,
		countries,
		$currentCountry,
		$goto
	});

	$$self.$inject_state = $$props => {
		if ('value' in $$props) $$invalidate(0, value = $$props.value);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [value, $goto, countries, select_change_handler];
}

class Header extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, {}, add_css);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Header",
			options,
			id: create_fragment.name
		});
	}
}

export { Class as C, Header as H, Icon as I, MaterialApp as M, Ripple as R, Style as S, mdiArrowRightBoldCircle as a, mdiArrowLeftBoldCircle as b, mdiRefresh as m, uid as u };
//# sourceMappingURL=Header.js.map
