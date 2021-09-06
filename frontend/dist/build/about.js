
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, a as append_styles, m as create_slot, b as validate_slots, e as element, g as attr_dev, o as toggle_class, h as add_location, j as insert_dev, p as action_destroyer, q as update_slot_base, r as get_all_dirty_from_scope, w as get_slot_changes, x as is_function, y as transition_in, z as transition_out, l as detach_dev, A as create_component, B as mount_component, C as destroy_component, f as space, D as set_style, k as append_dev, E as src_url_equal } from './main.js';
import { S as Style, M as MaterialApp, H as Header } from './Header.js';

/* node_modules/svelte-materialify/dist/components/Avatar/Avatar.svelte generated by Svelte v3.42.1 */
const file$1 = "node_modules/svelte-materialify/dist/components/Avatar/Avatar.svelte";

function add_css(target) {
	append_styles(target, "svelte-1srcwto", ".s-avatar{align-items:center;display:inline-flex;justify-content:center;line-height:normal;position:relative;text-align:center;vertical-align:middle;overflow:hidden;width:var(--s-avatar-size);height:var(--s-avatar-size)}.s-avatar.error-color,.s-avatar.info-color,.s-avatar.primary-color,.s-avatar.secondary-color,.s-avatar.success-color,.s-avatar.warning-color{color:#fff}.s-avatar:not(.tile){border-radius:50%}.s-avatar .s-icon,.s-avatar img,.s-avatar svg{color:inherit;border-radius:inherit;display:inline-flex;height:inherit;width:inherit}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXZhdGFyLnN2ZWx0ZSIsIm1hcHBpbmdzIjoiQUFVNkMsU0FBQSxBQUFBLENBQUEsb2hCQUE2cEIiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiQXZhdGFyLnN2ZWx0ZSJdfQ== */");
}

function create_fragment$1(ctx) {
	let div;
	let div_class_value;
	let Style_action;
	let current;
	let mounted;
	let dispose;
	const default_slot_template = /*#slots*/ ctx[5].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

	const block = {
		c: function create() {
			div = element("div");
			if (default_slot) default_slot.c();
			attr_dev(div, "class", div_class_value = "s-avatar " + /*klass*/ ctx[0]);
			attr_dev(div, "style", /*style*/ ctx[3]);
			toggle_class(div, "tile", /*tile*/ ctx[2]);
			add_location(div, file$1, 35, 0, 1007);
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

			if (!mounted) {
				dispose = action_destroyer(Style_action = Style.call(null, div, { 'avatar-size': /*size*/ ctx[1] }));
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[4],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
						null
					);
				}
			}

			if (!current || dirty & /*klass*/ 1 && div_class_value !== (div_class_value = "s-avatar " + /*klass*/ ctx[0])) {
				attr_dev(div, "class", div_class_value);
			}

			if (!current || dirty & /*style*/ 8) {
				attr_dev(div, "style", /*style*/ ctx[3]);
			}

			if (Style_action && is_function(Style_action.update) && dirty & /*size*/ 2) Style_action.update.call(null, { 'avatar-size': /*size*/ ctx[1] });

			if (dirty & /*klass, tile*/ 5) {
				toggle_class(div, "tile", /*tile*/ ctx[2]);
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
	validate_slots('Avatar', slots, ['default']);
	let { class: klass = '' } = $$props;
	let { size = 48 } = $$props;
	let { tile = false } = $$props;
	let { style = null } = $$props;
	const writable_props = ['class', 'size', 'tile', 'style'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Avatar> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('class' in $$props) $$invalidate(0, klass = $$props.class);
		if ('size' in $$props) $$invalidate(1, size = $$props.size);
		if ('tile' in $$props) $$invalidate(2, tile = $$props.tile);
		if ('style' in $$props) $$invalidate(3, style = $$props.style);
		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({ Style, klass, size, tile, style });

	$$self.$inject_state = $$props => {
		if ('klass' in $$props) $$invalidate(0, klass = $$props.klass);
		if ('size' in $$props) $$invalidate(1, size = $$props.size);
		if ('tile' in $$props) $$invalidate(2, tile = $$props.tile);
		if ('style' in $$props) $$invalidate(3, style = $$props.style);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [klass, size, tile, style, $$scope, slots];
}

class Avatar extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { class: 0, size: 1, tile: 2, style: 3 }, add_css);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Avatar",
			options,
			id: create_fragment$1.name
		});
	}

	get class() {
		throw new Error("<Avatar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<Avatar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get size() {
		throw new Error("<Avatar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<Avatar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get tile() {
		throw new Error("<Avatar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set tile(value) {
		throw new Error("<Avatar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get style() {
		throw new Error("<Avatar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set style(value) {
		throw new Error("<Avatar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/pages/about.svelte generated by Svelte v3.42.1 */
const file = "src/pages/about.svelte";

// (66:16) <Avatar size={120}>
function create_default_slot_4(ctx) {
	let img;
	let img_src_value;

	const block = {
		c: function create() {
			img = element("img");
			if (!src_url_equal(img.src, img_src_value = "https://avatars.githubusercontent.com/u/50198099?v=4")) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "Avatar");
			add_location(img, file, 65, 35, 4294);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(img);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_4.name,
		type: "slot",
		source: "(66:16) <Avatar size={120}>",
		ctx
	});

	return block;
}

// (69:16) <Avatar size={120}>
function create_default_slot_3(ctx) {
	let img;
	let img_src_value;

	const block = {
		c: function create() {
			img = element("img");
			if (!src_url_equal(img.src, img_src_value = "https://avatars.githubusercontent.com/u/43907402?v=4")) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "Avatar");
			add_location(img, file, 68, 35, 4520);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(img);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_3.name,
		type: "slot",
		source: "(69:16) <Avatar size={120}>",
		ctx
	});

	return block;
}

// (72:16) <Avatar size={120}>
function create_default_slot_2(ctx) {
	let img;
	let img_src_value;

	const block = {
		c: function create() {
			img = element("img");
			if (!src_url_equal(img.src, img_src_value = "https://avatars.githubusercontent.com/u/9653806?v=4")) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "Avatar");
			add_location(img, file, 71, 35, 4750);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(img);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_2.name,
		type: "slot",
		source: "(72:16) <Avatar size={120}>",
		ctx
	});

	return block;
}

// (75:16) <Avatar size={120}>
function create_default_slot_1(ctx) {
	let img;
	let img_src_value;

	const block = {
		c: function create() {
			img = element("img");
			if (!src_url_equal(img.src, img_src_value = "https://avatars.githubusercontent.com/u/48592277?v=4")) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "Avatar");
			add_location(img, file, 74, 35, 4975);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(img);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1.name,
		type: "slot",
		source: "(75:16) <Avatar size={120}>",
		ctx
	});

	return block;
}

// (10:0) <MaterialApp>
function create_default_slot(ctx) {
	let header;
	let t0;
	let div1;
	let br0;
	let t1;
	let h1;
	let t3;
	let br1;
	let t4;
	let p0;
	let t6;
	let br2;
	let br3;
	let t7;
	let h20;
	let t9;
	let br4;
	let t10;
	let p1;
	let t12;
	let br5;
	let br6;
	let t13;
	let h21;
	let t15;
	let br7;
	let t16;
	let p2;
	let t18;
	let br8;
	let t19;
	let h22;
	let t21;
	let br9;
	let t22;
	let p3;
	let t24;
	let br10;
	let t25;
	let h40;
	let t27;
	let br11;
	let t28;
	let p4;
	let t30;
	let h41;
	let t32;
	let br12;
	let t33;
	let p5;
	let t35;
	let br13;
	let br14;
	let t36;
	let h23;
	let t38;
	let br15;
	let br16;
	let t39;
	let div0;
	let a0;
	let avatar0;
	let t40;
	let a1;
	let avatar1;
	let t41;
	let a2;
	let avatar2;
	let t42;
	let a3;
	let avatar3;
	let t43;
	let br17;
	let current;
	header = new Header({ $$inline: true });

	avatar0 = new Avatar({
			props: {
				size: 120,
				$$slots: { default: [create_default_slot_4] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	avatar1 = new Avatar({
			props: {
				size: 120,
				$$slots: { default: [create_default_slot_3] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	avatar2 = new Avatar({
			props: {
				size: 120,
				$$slots: { default: [create_default_slot_2] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	avatar3 = new Avatar({
			props: {
				size: 120,
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(header.$$.fragment);
			t0 = space();
			div1 = element("div");
			br0 = element("br");
			t1 = space();
			h1 = element("h1");
			h1.textContent = "Who are we?";
			t3 = space();
			br1 = element("br");
			t4 = space();
			p0 = element("p");
			p0.textContent = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat amet natus obcaecati\r\n                molestiae quas mollitia error modi atque aliquam esse. Why cant I find a specific movie or tv show?\r\n                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat amet natus obcaecati\r\n                molestiae quas mollitia error modi atque aliquam esse. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat amet natus obcaecati\r\n                molestiae quas mollitia error modi atque aliquam esse. Why cant I find a specific movie or tv show?\r\n                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat amet natus obcaecati\r\n                molestiae quas mollitia error modi atque aliquam esse.";
			t6 = space();
			br2 = element("br");
			br3 = element("br");
			t7 = space();
			h20 = element("h2");
			h20.textContent = "Our vision";
			t9 = space();
			br4 = element("br");
			t10 = space();
			p1 = element("p");
			p1.textContent = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat amet natus obcaecati\r\n                molestiae quas mollitia error modi atque aliquam esse. Why cant I find a specific movie or tv show?\r\n                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat amet natus obcaecati\r\n                molestiae quas mollitia error modi atque aliquam esse. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat amet natus obcaecati\r\n                molestiae quas mollitia error modi atque aliquam esse. Why cant I find a specific movie or tv show?\r\n                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat amet natus obcaecati\r\n                molestiae quas mollitia error modi atque aliquam esse.";
			t12 = space();
			br5 = element("br");
			br6 = element("br");
			t13 = space();
			h21 = element("h2");
			h21.textContent = "Contact";
			t15 = space();
			br7 = element("br");
			t16 = space();
			p2 = element("p");
			p2.textContent = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat amet natus obcaecati\r\n                molestiae quas mollitia error modi atque aliquam esse. Why cant I find a specific movie or tv show?\r\n                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat amet natus obcaecati\r\n                molestiae quas mollitia error modi atque aliquam esse.";
			t18 = space();
			br8 = element("br");
			t19 = space();
			h22 = element("h2");
			h22.textContent = "Data sources";
			t21 = space();
			br9 = element("br");
			t22 = space();
			p3 = element("p");
			p3.textContent = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat amet natus obcaecati\r\n                molestiae quas mollitia error modi atque aliquam esse. Why cant I find a specific movie or tv show?\r\n                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat amet natus obcaecati\r\n                molestiae quas mollitia error modi atque aliquam esse.";
			t24 = space();
			br10 = element("br");
			t25 = space();
			h40 = element("h4");
			h40.textContent = "TMDB";
			t27 = space();
			br11 = element("br");
			t28 = space();
			p4 = element("p");
			p4.textContent = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat amet natus obcaecati\r\n                molestiae quas mollitia error modi atque aliquam esse. Why cant I find a specific movie or tv show?\r\n                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat amet natus obcaecati\r\n                molestiae quas mollitia error modi atque aliquam esse.";
			t30 = space();
			h41 = element("h4");
			h41.textContent = "Justwatch";
			t32 = space();
			br12 = element("br");
			t33 = space();
			p5 = element("p");
			p5.textContent = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat amet natus obcaecati\r\n                molestiae quas mollitia error modi atque aliquam esse. Why cant I find a specific movie or tv show?\r\n                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat amet natus obcaecati\r\n                molestiae quas mollitia error modi atque aliquam esse.";
			t35 = space();
			br13 = element("br");
			br14 = element("br");
			t36 = space();
			h23 = element("h2");
			h23.textContent = "Developers";
			t38 = space();
			br15 = element("br");
			br16 = element("br");
			t39 = space();
			div0 = element("div");
			a0 = element("a");
			create_component(avatar0.$$.fragment);
			t40 = space();
			a1 = element("a");
			create_component(avatar1.$$.fragment);
			t41 = space();
			a2 = element("a");
			create_component(avatar2.$$.fragment);
			t42 = space();
			a3 = element("a");
			create_component(avatar3.$$.fragment);
			t43 = space();
			br17 = element("br");
			add_location(br0, file, 12, 12, 299);
			set_style(h1, "text-align", "center");
			add_location(h1, file, 13, 12, 317);
			add_location(br1, file, 14, 12, 378);
			add_location(p0, file, 15, 12, 396);
			add_location(br2, file, 22, 12, 1180);
			add_location(br3, file, 22, 16, 1184);
			set_style(h20, "text-align", "center");
			add_location(h20, file, 23, 12, 1202);
			add_location(br4, file, 24, 12, 1262);
			add_location(p1, file, 25, 12, 1280);
			add_location(br5, file, 32, 12, 2064);
			add_location(br6, file, 32, 16, 2068);
			set_style(h21, "text-align", "center");
			add_location(h21, file, 33, 12, 2086);
			add_location(br7, file, 34, 12, 2143);
			add_location(p2, file, 35, 12, 2161);
			add_location(br8, file, 39, 12, 2563);
			set_style(h22, "text-align", "center");
			add_location(h22, file, 40, 12, 2581);
			add_location(br9, file, 41, 12, 2643);
			add_location(p3, file, 42, 12, 2661);
			add_location(br10, file, 46, 12, 3063);
			set_style(h40, "text-align", "center");
			add_location(h40, file, 47, 12, 3081);
			add_location(br11, file, 48, 12, 3135);
			add_location(p4, file, 49, 12, 3153);
			set_style(h41, "text-align", "center");
			add_location(h41, file, 53, 12, 3555);
			add_location(br12, file, 54, 12, 3614);
			add_location(p5, file, 55, 12, 3632);
			add_location(br13, file, 60, 12, 4036);
			add_location(br14, file, 60, 16, 4040);
			set_style(h23, "text-align", "center");
			add_location(h23, file, 61, 12, 4058);
			add_location(br15, file, 62, 12, 4118);
			add_location(br16, file, 62, 16, 4122);
			attr_dev(a0, "href", "https://github.com/Primdahl26");
			add_location(a0, file, 64, 16, 4217);
			attr_dev(a1, "href", "https://github.com/AndreasPB");
			add_location(a1, file, 67, 16, 4444);
			attr_dev(a2, "href", "https://github.com/nullxDEADBEEF");
			add_location(a2, file, 70, 16, 4670);
			attr_dev(a3, "href", "https://github.com/Pankai222");
			add_location(a3, file, 73, 16, 4899);
			attr_dev(div0, "class", "d-flex");
			set_style(div0, "justify-content", "space-between");
			add_location(div0, file, 63, 12, 4140);
			add_location(br17, file, 77, 12, 5141);
			attr_dev(div1, "class", "container");
			set_style(div1, "text-align", "center");
			set_style(div1, "max-width", "50%");
			set_style(div1, "margin", "0 auto");
			add_location(div1, file, 11, 8, 204);
		},
		m: function mount(target, anchor) {
			mount_component(header, target, anchor);
			insert_dev(target, t0, anchor);
			insert_dev(target, div1, anchor);
			append_dev(div1, br0);
			append_dev(div1, t1);
			append_dev(div1, h1);
			append_dev(div1, t3);
			append_dev(div1, br1);
			append_dev(div1, t4);
			append_dev(div1, p0);
			append_dev(div1, t6);
			append_dev(div1, br2);
			append_dev(div1, br3);
			append_dev(div1, t7);
			append_dev(div1, h20);
			append_dev(div1, t9);
			append_dev(div1, br4);
			append_dev(div1, t10);
			append_dev(div1, p1);
			append_dev(div1, t12);
			append_dev(div1, br5);
			append_dev(div1, br6);
			append_dev(div1, t13);
			append_dev(div1, h21);
			append_dev(div1, t15);
			append_dev(div1, br7);
			append_dev(div1, t16);
			append_dev(div1, p2);
			append_dev(div1, t18);
			append_dev(div1, br8);
			append_dev(div1, t19);
			append_dev(div1, h22);
			append_dev(div1, t21);
			append_dev(div1, br9);
			append_dev(div1, t22);
			append_dev(div1, p3);
			append_dev(div1, t24);
			append_dev(div1, br10);
			append_dev(div1, t25);
			append_dev(div1, h40);
			append_dev(div1, t27);
			append_dev(div1, br11);
			append_dev(div1, t28);
			append_dev(div1, p4);
			append_dev(div1, t30);
			append_dev(div1, h41);
			append_dev(div1, t32);
			append_dev(div1, br12);
			append_dev(div1, t33);
			append_dev(div1, p5);
			append_dev(div1, t35);
			append_dev(div1, br13);
			append_dev(div1, br14);
			append_dev(div1, t36);
			append_dev(div1, h23);
			append_dev(div1, t38);
			append_dev(div1, br15);
			append_dev(div1, br16);
			append_dev(div1, t39);
			append_dev(div1, div0);
			append_dev(div0, a0);
			mount_component(avatar0, a0, null);
			append_dev(div0, t40);
			append_dev(div0, a1);
			mount_component(avatar1, a1, null);
			append_dev(div0, t41);
			append_dev(div0, a2);
			mount_component(avatar2, a2, null);
			append_dev(div0, t42);
			append_dev(div0, a3);
			mount_component(avatar3, a3, null);
			append_dev(div1, t43);
			append_dev(div1, br17);
			current = true;
		},
		p: function update(ctx, dirty) {
			const avatar0_changes = {};

			if (dirty & /*$$scope*/ 1) {
				avatar0_changes.$$scope = { dirty, ctx };
			}

			avatar0.$set(avatar0_changes);
			const avatar1_changes = {};

			if (dirty & /*$$scope*/ 1) {
				avatar1_changes.$$scope = { dirty, ctx };
			}

			avatar1.$set(avatar1_changes);
			const avatar2_changes = {};

			if (dirty & /*$$scope*/ 1) {
				avatar2_changes.$$scope = { dirty, ctx };
			}

			avatar2.$set(avatar2_changes);
			const avatar3_changes = {};

			if (dirty & /*$$scope*/ 1) {
				avatar3_changes.$$scope = { dirty, ctx };
			}

			avatar3.$set(avatar3_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(header.$$.fragment, local);
			transition_in(avatar0.$$.fragment, local);
			transition_in(avatar1.$$.fragment, local);
			transition_in(avatar2.$$.fragment, local);
			transition_in(avatar3.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(header.$$.fragment, local);
			transition_out(avatar0.$$.fragment, local);
			transition_out(avatar1.$$.fragment, local);
			transition_out(avatar2.$$.fragment, local);
			transition_out(avatar3.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(header, detaching);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(div1);
			destroy_component(avatar0);
			destroy_component(avatar1);
			destroy_component(avatar2);
			destroy_component(avatar3);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(10:0) <MaterialApp>",
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

			if (dirty & /*$$scope*/ 1) {
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
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('About', slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({ MaterialApp, Avatar, Header });
	return [];
}

class About extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "About",
			options,
			id: create_fragment.name
		});
	}
}

export { About as default };
//# sourceMappingURL=about.js.map
