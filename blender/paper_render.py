# Рендер «бумажной» наклейки в Blender из SVG-слоёв (см. export_layers.js).
# blender -b -P blender/paper_render.py -- <папка_слоёв> <out.png> [samples]
import bpy, json, os, sys, math
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:]
src, out = argv[0], argv[1]
samples = int(argv[2]) if len(argv) > 2 else 96
m = json.load(open(os.path.join(src, "manifest.json")))

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

def lin(c):
    c /= 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

mats = {}
def paper(hexc):
    if hexc in mats:
        return mats[hexc]
    mat = bpy.data.materials.new(hexc)
    mat.use_nodes = True
    nt = mat.node_tree
    b = nt.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*[lin(int(hexc[i:i + 2], 16)) for i in (1, 3, 5)], 1)
    b.inputs["Roughness"].default_value = 0.9
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 1400
    noise.inputs["Detail"].default_value = 10
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.12
    nt.links.new(noise.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], b.inputs["Normal"])
    mats[hexc] = mat
    return mat

GAP, EXT = 0.0011, 0.00035          # шаг между слоями и толщина бумаги, м
in_layer = {}
frame_objs = []
frame_layer = next(s["layer"] for s in m["shapes"] if s["frame"])
for s in m["shapes"]:
    before = set(bpy.data.objects)
    bpy.ops.import_curve.svg(filepath=os.path.join(src, s["file"]))
    new = [o for o in bpy.data.objects if o not in before and o.type == "CURVE"]
    base = math.floor(s["layer"])
    k = in_layer.get(base, 0)
    in_layer[base] = k + 1
    for o in new:
        o.data.dimensions = "2D"
        o.data.fill_mode = "BOTH"
        o.data.extrude = EXT * (2.5 if s["frame"] else 1)
        o.location.z = s["layer"] * GAP + (k * EXT * 1.6 if s["layer"] == base else 0) + (GAP * 0.8 if s["layer"] >= frame_layer else 0) + (EXT * 2 if s["layer"] > frame_layer else 0)
        o.data.materials.clear()
        o.data.materials.append(paper(s["fill"]))
        if s["frame"]:
            frame_objs.append(o)

# границы наклейки по рамке
bpy.context.view_layer.update()
pts = [o.matrix_world @ Vector(c) for o in frame_objs for c in o.bound_box]
minx, maxx = min(p.x for p in pts), max(p.x for p in pts)
miny, maxy = min(p.y for p in pts), max(p.y for p in pts)
W, H = maxx - minx, maxy - miny
cx, cy = (minx + maxx) / 2, (miny + maxy) / 2

# камера: почти сверху, лёгкая перспектива
cam_data = bpy.data.cameras.new("cam")
cam_data.sensor_fit = "VERTICAL"
cam_data.sensor_height = 36
cam_data.lens = 100
cam = bpy.data.objects.new("cam", cam_data)
scene.collection.objects.link(cam)
D = (H / 2) / math.tan(math.atan(18 / 100))
frame_z = max(p.z for p in pts)             # верх рамки — плоскость, на которую ляжет текст
cam.location = (cx, cy, frame_z + D)
scene.camera = cam

# солнце слева сверху: жёсткие, но мягкие по краю тени между слоями
sun_data = bpy.data.lights.new("sun", "SUN")
sun_data.energy = 3.2
sun_data.angle = math.radians(7)
sun = bpy.data.objects.new("sun", sun_data)
sun.rotation_euler = (math.radians(38), math.radians(-22), math.radians(-30))
scene.collection.objects.link(sun)

world = bpy.data.worlds.new("w")
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.55
scene.world = world

scene.render.engine = "CYCLES"
scene.cycles.samples = samples
scene.cycles.use_denoising = True
try:
    prefs = bpy.context.preferences.addons["cycles"].preferences
    prefs.compute_device_type = "METAL"
    prefs.get_devices()
    for d in prefs.devices:
        d.use = True
    scene.cycles.device = "GPU"
except Exception as e:
    print("GPU недоступен:", e)
scene.view_settings.view_transform = "Standard"
scene.render.resolution_x = 900
scene.render.resolution_y = 1200
scene.render.filepath = out
bpy.ops.render.render(write_still=True)
print("готово:", out)
