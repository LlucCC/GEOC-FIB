/**
 TODO Replace this by your own, correct, triangulation function
 Triangles should be return as arrays of array of indexes
 e.g., [[1,2,3],[2,3,4]] encodes two triangles, where the indices are relative to the array points
**/

function determinantPoint2Segment(p, sFrom, sTo){
	return ((sTo.x - sFrom.x)*(p.y - sFrom.y)) - ((sTo.y - sFrom.y)*(p.x - sFrom.x));
}
  
function pointOnSegment(p, det, sFrom, sTo) {
	if (det == 0 && ((p.x - sFrom.x)*(p.x - sTo.x) <= 0) && ((p.y - sFrom.y)*(p.y - sTo.y) <= 0)) return true;
	else return false; 
}

function pointInVertex(point, vertex) {
	if (point.x == vertex.x && point.y == vertex.y) return true;
	else return false;
}

function classifyPoint(p, triangle) {
	let detS1 = determinantPoint2Segment(p, triangle[0], triangle[1]);
	let detS2 = determinantPoint2Segment(p, triangle[1], triangle[2]);
	let detS3 = determinantPoint2Segment(p, triangle[2], triangle[0]);
  
  
	if (pointInVertex(p, triangle[0]) || pointInVertex(p, triangle[1]) || pointInVertex(p, triangle[2])) {
	  return 3;
	  //Point on a vertex (duplicated point)
	}
	else if (pointOnSegment(p, detS1, triangle[0], triangle[1]) || pointOnSegment(p, detS2, triangle[1], triangle[2]) || pointOnSegment(p, detS3, triangle[2], triangle[0])){
	  return 2;
	  //Point on an edge
	}
	else if ((detS1 < 0 && detS2 < 0 && detS3 < 0) || (detS1 > 0 && detS2 > 0 && detS3 > 0)) {
	  return 1;
	  //Interior of the triangle
	}
	else {
	  return 0;
	}
}

function counterclockwise(points) {
	if (determinantPoint2Segment(points[2], points[0], points[1]) >= 0) return true;
	else return false;
}

class Hierarchy {
	constructor(triangle, rootId) {
		this.root = triangle;
		this.left = null;
		this.center = null;
		this.right = null;
		this.id = rootId;
	}

	addFaces(t1, t2, t3, f1, f2, f3) {
		this.left = new Hierarchy(t1, f1);
		this.center = new Hierarchy(t2, f2);
		this.right = new Hierarchy(t3, f3);
	}

	addFaces2(t1, t2, f1, f2) {
		this.left = new Hierarchy(t1, f1);
		this.center = new Hierarchy(t2, f2);
	}

	searchTriangle(p) {
		let test = classifyPoint(p, this.root);

		if (test == 2) {
			if (this.left == null) {
				//console.log("Returning face " + this.id);
				return [this.id, 1, this];
			}

			//console.log(this.left);
			let leftSearch = this.left.searchTriangle(p);
			if (leftSearch[1] == 1) return leftSearch;
			
			//console.log(this.center);
			let centerSearch = this.center.searchTriangle(p);
			if (centerSearch[1] == 1 ) return centerSearch;

			//console.log(this.right);
			let rightSearch = [-1, -1];
			if (this.right != null) rightSearch = this.right.searchTriangle(p);
			return rightSearch;
		}
		else if (test == 3){
			//Duplicated point
			return [this.id, -2, this];
		} 
		else if (test == 1) {
			//console.log("Further Search of point: ");
			//console.log(p);
			if (this.left == null) {
				//console.log("Returning face " + this.id);
				return [this.id, -1, this];
			}

			//console.log(this.left);
			let leftSearch = this.left.searchTriangle(p);
			if(leftSearch[3] != null) return leftSearch;
			let centerSearch = this.center.searchTriangle(p);
			if(centerSearch[3] != null) return centerSearchSearch;
			let rightSearch = [-1, -1];
			if (this.right != null) rightSearch = this.right.searchTriangle(p);
			if (leftSearch[1] == 1) {
				if (centerSearch[1] == 1) {
					return [leftSearch[0], 1, leftSearch[2], centerSearch[2]];
				}
				else return [leftSearch[0], 1, leftSearch[2], rightSearch[2]];
			}
			if (leftSearch[0] != -1) return leftSearch;
			
			//console.log(this.center);
			if (centerSearch[1] == 1) {
				return [leftSearch[0], 1, centerSearch[2], rightSearch[2]];
			}
			if (centerSearch[0] != -1 ) return centerSearch;

			//console.log(this.right);
			
			return rightSearch;
		}
		return [-1, -1];
	}
}

var hier;

class DCEL {
	constructor(Triangle, n) {
		this.vertices = {};
		for (let i = 0; i < 3; ++i) {
			this.vertices[n + i] = {
				x: Triangle[i].x,
				y: Triangle[i].y,
				e: i,
			}
		}

		this.faces = {};
		
		this.faces[0]= {
			e: 0
		};
		
		this.edges = {};

		for(let i = 0; i < 3; ++i){
			this.edges[i] = {
				vb: n + i,
				ve: n + (i + 1)%3,
				fl: -1,
				fr: 0,
				ep: (i + 2)%3,
				en: (i + 1)%3,
			}
		}
		
		this.vertexIndex = 0;
		this.edgesNum = 3;
		this.facesNum = 1;
	}	

	addTriangle() {}

	faceTriangle(f_index) {
		
		if (this.faces[f_index] == null) return [0, 0, 0];
		let edge = this.faces[f_index].e;
		let v1 = this.edges[edge].vb;
		let v2 = this.edges[edge].ve;
		let fl = this.edges[edge].fl;
		//let fr = this.edges[edge].fr;
		let v3;
		/*if (f_index == 7) {
			console.log("Values of the face: " + f_index);
			console.log("edge " + edge);
			console.log(this.edges[edge]);
			console.log("next edge " + this.edges[edge].en);
			console.log(this.edges[this.edges[edge].en]);
			console.log("previous edge " + this.edges[edge].ep);
			console.log(this.edges[this.edges[edge].ep]);
			console.log("v1 " + v1);
			console.log("v2 " + v2);
		}*/
		if (fl == f_index) {
			let ep = this.edges[edge].ep;
			if (this.edges[ep].vb === v1) v3 = this.edges[ep].ve;
			else v3 = this.edges[ep].vb;
		}
		else {
			let en = this.edges[edge].en;
			if (this.edges[en].vb === v2) v3 = this.edges[en].ve;
			else v3 = this.edges[en].vb;
		}
		//console.log("v3 " + v3);
		if (!counterclockwise([this.vertices[v1],this.vertices[v2], this.vertices[v3]])) return [v1, v3, v2];
		return [v1, v2, v3];
	}
	
	
	find_face(p) {
		
		let numFaces = this.facesNum;
		let res = [-1, -1];
		//console.log("Searching for point");
		//console.log(p);
		for (let i = 0; i < numFaces; ++i) {
			//console.log("iteration " + i);
			let triangleIn = this.faceTriangle(i);
			let triangle = [this.vertices[triangleIn[0]], this.vertices[triangleIn[1]], this.vertices[triangleIn[2]]];
			//console.log("Found triangle" );
			//console.log(triangle);
			let test = classifyPoint(p, triangle);
			if (test == 2) {
				//console.log("Dos");
				let otherFace = this.edges[this.faces[i].e].fl == i ? this.edges[this.faces[i].e].fr : this.edges[this.faces[i].e].fl;
				//console.log(i + " " + otherFace);
				return [i, otherFace];
			}
			else if (test == 3){
				//console.log("Tres");
				return [i, -2];
			} 
			else if (test == 1) {
				//console.log("Inside")
				return [i, 0];
			}
		}
		//console.log(res);
		return res;
	}

	searchEdge(face, point) {
		if (this.faces[face] == null) return [0, 0, 0];
		let e1 = this.faces[face].e;
		//console.log("e1: " + e1);
		let v1 = this.vertices[this.edges[e1].vb];
		let v2 = this.vertices[this.edges[e1].ve];

		let det = determinantPoint2Segment(point, v1, v2);
		if (det == 0) return e1;

		let e2 = this.edges[e1].fl == face ? this.edges[e1].ep : this.edges[e1].en;
		//console.log("e2: " + e2);
		v1 = this.vertices[this.edges[e2].vb];
		v2 = this.vertices[this.edges[e2].ve];

		det = determinantPoint2Segment(point, v1, v2);
		if (det == 0) return e2;

		let e3 = this.edges[e2].fl == face ? this.edges[e2].ep : this.edges[e2].en;
		//console.log("e3: " + e3);
		v1 = this.vertices[this.edges[e3].vb];
		v2 = this.vertices[this.edges[e3].ve];

		det = determinantPoint2Segment(point, v1, v2);
		if (det == 0) return e3;

		//console.log(point);
	}

	twoOtherVertices(edge) {
		let vb = this.edges[edge].vb
		let ve = this.edges[edge].ve

		let vl = this.edges[this.edges[edge].ep].vb == vb ? this.edges[this.edges[edge].ep].ve : this.edges[this.edges[edge].ep].vb
		let vr = this.edges[this.edges[edge].en].vb == ve ? this.edges[this.edges[edge].en].ve : this.edges[this.edges[edge].en].vb

		return [vl, vr];
	}
	
	addPoint(p) {
		//console.log("Inserting point " + this.vertexIndex);

		
		let face = hier.searchTriangle(p);
		if (face[2] == -2) {
			console.log("repeated")
			this.vertexIndex += 1;
			return;
		}
		//console.log(face[0])
		//let triangle = [Points[triangleIn[0]], Points[triangleIn[1]], Points[triangleIn[2]]];
		let el = this.edgesNum;
		let fl = this.facesNum;
		this.vertices[this.vertexIndex] = {
			x: p.x,
			y: p.y,
			e: el	
		}
		//console.log("found face " + face[0]);

		let actHier = face[2];
		
		if (face[1] == 1) {
			let actHier2 = face[3];
			let f = face[0];
			let edg = this.searchEdge(f, p);
			//console.log(edg);
			let toConect = this.twoOtherVertices(edg);
			f = this.edges[edg].fl;

			let fright = this.edges[edg].fr;
			let vb = this.edges[edg].vb;
			let ve = this.edges[edg].ve;
			let en = this.edges[edg].en;
			let ep =  this.edges[edg].ep;
			
			/*console.log(this.edges[edg].ve);
			console.log(ep);
			console.log(en);
			console.log(this.edges[ep]);
			console.log(this.edges[en]);*/

			console.log(actHier2);
			console.log(actHier);
			console.log(f)
			if (f != actHier.id) {

				//console.log("Nooo");
				actHier = face[3];
				actHier2 = face[2];
			}
			else console.log(":)");

			let next1;
			let e = this.faces[f].e;
			for (let i = 0; i < 3; ++i) {
				let edge = this.edges[e];
				
				if (edge.vb == toConect[0] && edge.ve == ve || edge.vb == ve && edge.ve == toConect[0]) next1 = e;
				if (edge.fl == f) e = edge.ep;
				else e = edge.en;
			}
			
			let next2;
			e = this.faces[fright].e;
			for (let i = 0; i < 3; ++i) {
				let edge = this.edges[e];
				
				if (edge.vb == toConect[1] && edge.ve == vb || edge.vb == vb && edge.ve == toConect[1]) next2 = e;
				if (edge.fl == fright) e = edge.ep;
				else e = edge.en;
			}

			//Connecting f1
			this.edges[el + 1] = {
				vb: this.vertexIndex,
				ve: toConect[0],
				fl: f,
				fr: fl,
				ep: edg,
				en: next1
			}

			
			this.edges[el + 2] = {
				vb: this.vertexIndex,
				ve: toConect[1],
				fl: fl + 1,
				fr: fl + 2,
				ep: el,
				en: next2
			}

			this.edges[el] = {
				vb: this.vertexIndex,
				ve: ve,
				fl: fl,
				fr: fl + 1,
				ep: el + 1,
				en: en
			}

		
			this.edges[edg] = {
				vb: vb,
				ve: this.vertexIndex,
				fl: f,
				fr: fl + 2,
				ep: ep,
				en: el + 2
			}

			if (this.edges[next1].fl == f) {
				this.edges[next1].ep = el;
				this.edges[next1].fl = fl;
			}
			else {
				this.edges[next1].en = el;
				this.edges[next1].fr = fl;
			}
			
			
			if (this.edges[next2].fl == fright) {
				this.edges[next2].ep = edg;
				this.edges[next2].fl = fl + 2;
			}
			else {
				this.edges[next2].en = edg;
				this.edges[next2].fr = fl + 2;
			}
	
			if (this.edges[ep].fl == f) {
				this.edges[ep].ep = el + 1;
				this.edges[ep].fl = f;
			}
			else {
				this.edges[ep].en = el + 1;
				this.edges[ep].fr = f;
			}

			if (this.edges[en].fl == f) {
				this.edges[en].ep = el + 2;
				this.edges[en].fl = fl + 1;
			}
			else {
				this.edges[en].en = el + 2;
				this.edges[en].fr = fl + 1;
			}

			this.faces[f]  = {
				e: edg
			}

			this.faces[fl]  = {
				e: el + 1
			}

			this.faces[fl + 1]  = {
				e: el
			}

			this.faces[fl + 2]  = {
				e: el + 2
			}

			this.vertexIndex += 1;
			this.facesNum += 3;
			this.edgesNum += 3;

			//console.log("Vertex num: " + (this.vertexIndex - 2));
			//console.log("inserting new face " + face);
			let t1 = [this.vertices[vb], this.vertices[toConect[0]], p];
			//console.log(vb, toConect[0], this.vertexIndex - 1);

			//console.log("inserting new face " + fl);

			let t2 = [this.vertices[ve], p, this.vertices[toConect[0]]];
			//console.log(ve, this.vertexIndex - 1, toConect[0]);
			actHier.addFaces2(t1, t2, f, fl);

			//console.log("inserting new face " + (fl + 1));
			let t3 = [this.vertices[ve], this.vertices[toConect[1]], p];
			//console.log(ve, toConect[1], this.vertexIndex - 1);

			//console.log("inserting new face " + (fl + 1));
			let t4 = [p, this.vertices[vb], this.vertices[toConect[1]]];
			//console.log(this.vertexIndex - 1, ve, toConect[1]);


			actHier2.addFaces2(t3, t4, fl + 1, fl + 2);
			return;
		}

		let triangle = this.faceTriangle(face[0]);
	
		
		face = face[0];
		let next1;
		//console.log(face);
		let e = this.faces[face].e;
		for (let i = 0; i < 3; ++i) {
			let edge = this.edges[e];
			
			if ((edge.vb == triangle[0] && edge.ve == triangle[1]) || (edge.vb == triangle[1] && edge.ve == triangle[0])) next1 = e;
			if (edge.fl == face) e = edge.ep;
			else e = edge.en;
		}
		
		

		let next2;
		e = this.faces[face].e;
		for (let i = 0; i < 3; ++i) {
			let edge = this.edges[e];
			if ((edge.vb == triangle[1] && edge.ve == triangle[2]) || (edge.vb == triangle[2] && edge.ve == triangle[1])) {
				next2 = e;
			}
			if (edge.fl == face) e = edge.ep;
			else e = edge.en;
		}
		


		let next3;
		e = this.faces[face].e;
		for (let i = 0; i < 3; ++i) {
			let edge = this.edges[e];
			if ((edge.vb == triangle[2] && edge.ve == triangle[0]) || (edge.vb == triangle[0] && edge.ve == triangle[2])) next3 = e;
			if (edge.fl == face) e = edge.ep;
			else e = edge.en;
		}


		this.edges[el] = {
			vb: this.vertexIndex,
			ve: triangle[0],
			fl: face,
			fr: fl,
			ep: el + 2,
			en: next1,
		}
		
		this.edges[1 + el] = {
			vb: this.vertexIndex,
			ve: triangle[1],
			fl: fl,
			fr: fl + 1,
			ep: el,
			en: next2,
		}
		this.edges[2 + el] = {
			vb: this.vertexIndex,
			ve: triangle[2],
			fl: fl + 1,
			fr: face,
			ep: el + 1,
			en: next3,
		}

		if (this.edges[next1].fl == face) {
			this.edges[next1].ep = el + 1;
			this.edges[next1].fl = fl;
		}
		else {
			this.edges[next1].en = el + 1;
			this.edges[next1].fr = fl;
		}
		
		
		if (this.edges[next2].fl == face) {
			this.edges[next2].ep = el + 2;
			this.edges[next2].fl = fl + 1;
		}
		
		else {
			this.edges[next2].en = el + 2;
			this.edges[next2].fr = fl + 1;
		}

		if (this.edges[next3].fl == face) {
			this.edges[next3].ep = el;
			this.edges[next3].fl = face;
		}
		else {
			this.edges[next3].en = el;
			this.edges[next3].fr = face;
		}

		this.faces[fl] = {
			e: el + 1
		};

		this.faces[fl + 1] = {
			e: el + 2
		};

		this.faces[face] = {
			e: el 
		};

		//console.log("ve : " + this.edges[next3].ve);

		this.facesNum += 2;
		this.edgesNum += 3;
		//console.log("inserting new face " + face);
		let t1 = [this.vertices[triangle[0]], p, this.vertices[triangle[2]]];
		//console.log(triangle[0], triangle[1], this.vertexIndex);

		
		//console.log("inserting new face " + fl);
		let t2 = [this.vertices[triangle[0]], this.vertices[triangle[1]], p];
		//console.log(triangle[2], triangle[0], this.vertexIndex);

		//console.log("inserting new face " + (fl + 1));
		let t3 = [p, this.vertices[triangle[1]], this.vertices[triangle[2]]];
		//console.log(triangle[1], triangle[2], this.vertexIndex);

		//console.log(fl);
		actHier.addFaces(t1, t2, t3, face, fl, fl + 1);

		this.vertexIndex += 1;
	}
}

function findMin(points) {
	n = points.length;
	minX = points[0].x;
	minY = points[0].y;
	for (let i = 1; i < n; ++i) {
		if (points[i].x < minX) minX = points[i].x;
		if (points[i].y < minY) minY = points[i].y;
	}
	return {
		x: minX,
		y: minY
	};
}

function findMax(points) {
	n = points.length;
	maxX = points[0].x;
	maxY = points[0].y;
	for (let i = 1; i < n; ++i) {
		if (points[i].x > maxX) maxX = points[i].x;
		if (points[i].y > maxY) maxY = points[i].y;
	}
	return {
		x: maxX,
		y: maxY
	};
}

function computeTriangulation(points) {
	
	let min = findMin(points);
	let max = findMax(points);
	let t1 = {
		x: min.x - 0.1,
		y: min.y - 0.1
	};
	let t2 = {
		x: min.x - 0.1,
		y: max.y + (max.y - min.y) + 0.1
	};
	let t3 = {
		x: max.x + (max.x - min.x) + 0.1,
		y: min.y - 0.1 
	};

	let n = points.length;
	points[n] = t1;
	points[n + 1] = t2;
	points[n + 2] = t3;

	let triangle = [t1,t2,t3];
	let dcel = new DCEL(triangle,n);
	hier = new Hierarchy(triangle, 0);

	let faces = 0;
	for(p in points) {
		if (p < n) dcel.addPoint(points[p]);
	}
	faces = dcel.facesNum;
	
	let outputTriangles = new Array(faces); 
	for (i=0;i<faces;i++) {
		outputTriangles[i] = dcel.faceTriangle(i); // Store INDICES, not points
	}

	return outputTriangles;
}



