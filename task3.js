// TODO: Task 3 - Skinning a custom mesh.
//
// In this task you will be skinning a given 'arm' mesh with multiple bones.
// We have already provided the initial locations of the two bones for your convenience
// You will have to add multiple bones to do a convincing job.
var Task3 = function (gl) {
	this.distance = 10;
	this.pitch = 30;
	this.yaw = 0;
	this.lookat = new Vector(5, 0, 0);

	this.showJoints = true;

	// Create a skin mesh
	this.skin = new SkinMesh(gl);
	this.skin.createArmSkin();

	// Create an empty skeleton for now.
	this.skeleton = new Skeleton();

	// TODO: Task-3
	// Create additional joints as required.
	this.mJoint1 = new Joint(null, new Vector(-15, 0, 0), new Vector(-8.5, 0, 0), new Vector(0, 1, 0), "Upper Arm", gl);
	this.mJoint2 = new Joint(this.mJoint1, new Vector(7, 0, 0), new Vector(12.5, 0, 0), new Vector(0, -1, 0), "Forearm", gl);

	// Add your joints to the skeleton here
	this.skeleton.addJoint(this.mJoint1);
	this.skeleton.addJoint(this.mJoint2);


	// set the skeleton
	this.skin.setSkeleton(this.skeleton, "linear");

	gl.enable(gl.DEPTH_TEST);
}

Task3.prototype.render = function (gl, w, h) {
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var projection = Matrix.perspective(60, w / h, 0.1, 100);
	var view =
		Matrix.translate(0, 0, -this.distance).multiply(
			Matrix.rotate(this.pitch, 1, 0, 0)).multiply(
				Matrix.rotate(this.yaw, 0, 1, 0)).multiply(
					Matrix.translate(this.lookat.x, this.lookat.y, this.lookat.z)
				);

	if (this.skin)
		this.skin.render(gl, view, projection, false);

	if (this.skeleton && this.showJoints) {
		gl.clear(gl.DEPTH_BUFFER_BIT);
		this.skeleton.render(gl, view, projection);
	}
}

Task3.prototype.setJointAngle = function (id, value) {
	if (this.skeleton && id < this.skeleton.getNumJoints()) {
		this.skeleton.getJoint(id).setJointAngle(value);
		this.skin.updateSkin();
	}
}

Task3.prototype.drag = function (event) {
	var dx = event.movementX;
	var dy = event.movementY;
	this.pitch = Math.min(Math.max(this.pitch + dy * 0.5, -90), 90);
	this.yaw = this.yaw + dx * 0.5;
}

Task3.prototype.wheel = function (event) {
	const newZoom = this.distance * Math.pow(2, event.deltaY * -0.01);
	this.distance = Math.max(0.02, Math.min(100, newZoom));
}

Task3.prototype.showJointWeights = function (idx) {
	this.skin.showJointWeights(idx);
	this.skin.updateSkin();
}

Task3.prototype.setShowJoints = function (showJoints) {
	this.showJoints = showJoints;
}
