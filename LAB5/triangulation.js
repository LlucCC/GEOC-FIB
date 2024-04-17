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

function det(x, a, b, c) {
	var M11 = (b.x-a.x);
	var M12 = (b.y-a.y);
	var M13 = ((b.x - a.x)*(b.x + a.x) + (b.y - a.y)*(b.y + a.y));
	var M21 = (c.x-a.x);
	var M22 = (c.y-a.y);
	var M23 = ((c.x - a.x)*(c.x + a.x) + (c.y - a.y)*(c.y + a.y));
	var M31 = (x.x-a.x);
	var M32 = (x.y-a.y);
	var M33 = ((x.x - a.x)*(x.x + a.x) + (x.y - a.y)*(x.y + a.y));
  
	return M11*M22*M33 + M12*M23*M31 + M21*M32*M13 - M13*M22*M31 - M12*M21*M33 - M23*M32*M11;
  }

function classifyPointTriangle(p, triangle) {
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

function classifyPointCircle(p, circle_points) {
	var detC;
	if (counterclockwise(circle_points)) {
	  detC = det(p, circle_points[0], circle_points[1], circle_points[2]);
	}
	  else {
	  detC = det(p, circle_points[2], circle_points[1], circle_points[0]);
	}
	
	if (detC == 0) {
		return 0 //Boundary
	}
	
	else if (detC < 0) {
	  return -1 //Interior
	}
	else {
		return 1 //Exterior
	}
}

function between(p1, p2, q1, q2) {
	if ((p1.x - q1.x)*(p1.x - q2.x) <= 0 && (p2.x - q1.x)*(p2.x - q2.x) <= 0) return true
	if ((p1.x - q1.x)*(p2.x - q1.x) <= 0 && (p1.x - q2.x)*(p2.x - q2.x) <= 0) return true
}

function classifyIntersection(s1, s2) {
	var intersectionType, intersectionTypeDescription;
	// Dummy code: an absurd classification criterion
	var detA1 = (s1.to.x - s1.from.x)*(s2.from.y - s1.from.y) - (s2.from.x - s1.from.x)*(s1.to.y - s1.from.y)
	var detB1 = (s1.to.x - s1.from.x)*(s2.to.y - s1.from.y) - (s2.to.x - s1.from.x)*(s1.to.y - s1.from.y)
	var detA2 = (s1.from.x - s1.to.x)*(s2.from.y - s1.to.y) - (s2.from.x - s1.to.x)*(s1.from.y - s1.to.y)
	var detB2 = (s1.from.x - s1.to.x)*(s2.to.y - s1.to.y) - (s2.to.x - s1.to.x)*(s1.from.y - s1.to.y)
	var det1A = (s2.to.x - s2.from.x)*(s1.from.y - s2.from.y) - (s1.from.x - s2.from.x)*(s2.to.y - s2.from.y)
	var det1B = (s2.to.x - s2.from.x)*(s1.to.y - s2.from.y) - (s1.to.x - s2.from.x)*(s2.to.y - s2.from.y)

	if ((s1.from.x == s2.from.x && s1.from.y == s2.from.y) && (s1.to.x == s2.to.x && s1.to.y == s2.to.y)) {
		return true
	}

	else if ((s1.from.x == s2.from.x && s1.from.y == s2.from.y) || (s1.to.x == s2.to.x && s1.to.y == s2.to.y)) {
		return true
	}
	
	else if ((detA1 == 0 && (s2.from.x - s1.from.x)*(s2.from.x - s1.to.x) <= 0 && (s2.from.y - s1.from.y)*(s2.from.y - s1.to.y) <= 0) && (detB1 == 0 && (s2.to.x - s1.from.x)*(s2.to.x - s1.to.x) <= 0 && (s2.to.y - s1.from.y)*(s2.to.y - s1.to.y) <= 0)) {
		return true
	}

	else if ((detA1 == 0 && (s2.from.x - s1.from.x)*(s2.from.x - s1.to.x) <= 0 && (s2.from.y - s1.from.y)*(s2.from.y - s1.to.y) <= 0) || (detB1 == 0 && (s2.to.x - s1.from.x)*(s2.to.x - s1.to.x) <= 0 && (s2.to.y - s1.from.y)*(s2.to.y - s1.to.y) <= 0)) {
		return true
	}

	else if ((det1A == 0 && (s1.from.x - s2.from.x)*(s1.from.x - s2.to.x) <= 0 && (s1.from.y - s2.from.y)*(s1.from.y - s2.to.y) <= 0) && (det1B == 0 && (s1.to.x - s2.from.x)*(s1.to.x - s2.to.x) <= 0 && (s1.to.y - s2.from.y)*(s1.to.y - s2.to.y) <= 0)) {
		return true
	}

	else if ((det1A == 0 && (s1.from.x - s2.from.x)*(s1.from.x - s2.to.x) <= 0 && (s1.from.y - s2.from.y)*(s1.from.y - s2.to.y) <= 0) || (det1B == 0 && (s1.to.x - s2.from.x)*(s1.to.x - s2.to.x) <= 0 && (s1.to.y - s2.from.y)*(s1.to.y - s2.to.y) <= 0)) {
		return true
	}

	else if ((detA1 * detB1) < 0 && (detA2 * detB2) < 0)  {
		return true
	}

	else {
		return false
	}
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
		let test = classifyPointTriangle(p, this.root);

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
var dcel;

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
		
		this.referencePoint = {
			x: (Triangle[0].x + Triangle[1].x + Triangle[2].x)/3,
			y: (Triangle[0].y + Triangle[1].y + Triangle[2].y)/3
		}

		this.referenceFace = 0;
	}	

	addTriangle() {}

	faceTriangle(f_index) {
		
		if (this.faces[f_index] == null) return [0, 0, 0];
		let e1,e2, v1, v2, v3
		
		e1 = this.faces[f_index].e;
		v1 = this.edges[e1].vb
		v2 = this.edges[e1].ve	
		e2 = this.edges[e1].fl == f_index ? this.edges[e1].ep : this.edges[e1].en	
		
		v3 = (this.edges[e2].vb == v1 || this.edges[e2].vb == v2) ? this.edges[e2].ve : this.edges[e2].vb

		if (!counterclockwise([this.vertices[v1],this.vertices[v2], this.vertices[v3]])) return [v1, v3, v2];
		return [v1, v2, v3];
	}

	barycenter(f) {
		let t = this.faceTriangle(f)
		let p1,p2,p3
		p1 = this.vertices[t[0]]
		p2 = this.vertices[t[1]]
		p3 = this.vertices[t[2]]

		let refPoint = {
			x: (p1.x + p2.x + p3.x)/3,
			y: (p1.y + p2.y + p3.y)/3
		}
		
		return refPoint;
	}
	
	point_location(p, f, eprev) {
		if (f == -1) {
			console.log("peneee")
			return [-1, -1]
		}
		let triangleIn = this.faceTriangle(f);
		let triangle = [this.vertices[triangleIn[0]], this.vertices[triangleIn[1]], this.vertices[triangleIn[2]]];


		let test = classifyPointTriangle(p, triangle)
		
		
		//console.log(segment)
		if (test == 1) {
			return [f, 0];
		}
		else if (test == 3){
			//console.log("Tres");
			return [f, -2];
		} 
		else if (test == 2) {
			//console.log("Dos");
			//console.log(i + " " + otherFace);
			return [f, 1];
		}

		
		else {
			let refPoint = this.barycenter(f)
			
			let e1 = this.faces[f].e
			let e2 = this.edges[e1].fl == f ? this.edges[e1].ep : this.edges[e1].en
			let e3 = this.edges[e2].fl == f ? this.edges[e2].ep : this.edges[e2].en

			let d1, d2, v1, v2, v3
			v1 = this.vertices[this.edges[e1].vb]
			v2 = this.vertices[this.edges[e1].ve]
		
			d1 = determinantPoint2Segment(refPoint, v1 , v2)
			d2 = determinantPoint2Segment(p, v1 , v2)

			if (d1*d2 < 0) {
				let nextFace = this.edges[e1].fl == f ? this.edges[e1].fr: this.edges[e1].fl
				return this.point_location(p, nextFace, e1)
			}

			v1 = this.vertices[this.edges[e2].vb]
			v2 = this.vertices[this.edges[e2].ve]

			d1 = determinantPoint2Segment(refPoint, v1 , v2)
			d2 = determinantPoint2Segment(p, v1 , v2)


			if (d1*d2 < 0) {
				let nextFace = this.edges[e2].fl == f ? this.edges[e2].fr: this.edges[e2].fl
				return this.point_location(p, nextFace, e2)
			}

			v1 = this.vertices[this.edges[e3].vb]
			v2 = this.vertices[this.edges[e3].ve]

			d1 = determinantPoint2Segment(refPoint, v1 , v2)
			d2 = determinantPoint2Segment(p, v1 , v2)

			if (d1*d2 < 0) {
				let nextFace = this.edges[e3].fl == f ? this.edges[e3].fr: this.edges[e3].fl
				return this.point_location(p, nextFace, e3)
			}

			else console.log(":(")

		}

	}

	find_face(p) {
		
		let numFaces = this.facesNum;
		let res = [-1, -2];
		//console.log("Searching for point");
		//console.log(p);
		for (let i = 0; i < numFaces; ++i) {
			//console.log("iteration " + i);
			let triangleIn = this.faceTriangle(i);
			let triangle = [this.vertices[triangleIn[0]], this.vertices[triangleIn[1]], this.vertices[triangleIn[2]]];
			//console.log("Found triangle" );
			//console.log(triangle);
			let test = classifyPointTriangle(p, triangle);
			if (test == 2) {
				//console.log("Dos");
				let otherFace = this.edges[this.faces[i].e].fl == i ? this.edges[this.faces[i].e].fr : this.edges[this.faces[i].e].fl;
				//console.log(i + " " + otherFace);
				return [i, 1];
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
	
	updateReferenceFace3(f,fr,fl) {
		let triangleIn1 = this.faceTriangle(f);
		let triangle1 = [this.vertices[triangleIn1[0]], this.vertices[triangleIn1[1]], this.vertices[triangleIn1[2]]];

		let test = classifyPointTriangle(this.referencePoint, triangle1);
		if (test == 1) {
			this.referenceFace = f
			this.referencePoint = {
				x: (triangle1[0].x + triangle1[1].x + triangle1[2].x)/3,
				y: (triangle1[0].y + triangle1[1].y + triangle1[2].y)/3
			}
			return;
		}
		else if (test == 2 || test == 3) {
			this.referenceFace = fl
			this.referencePoint = {
				x: (triangle1[0].x + triangle1[1].x + triangle1[2].x)/3,
				y: (triangle1[0].y + triangle1[1].y + triangle1[2].y)/3
			}
			return;
		}

		let triangleIn2 = this.faceTriangle(fr);
		let triangle2 = [this.vertices[triangleIn2[0]], this.vertices[triangleIn2[1]], this.vertices[triangleIn2[2]]];

		test = classifyPointTriangle(this.referencePoint, triangle2);
		if (test == 1) {
			this.referenceFace = fr
			this.referencePoint = {
				x: (triangle2[0].x + triangle2[1].x + triangle2[2].x)/3,
				y: (triangle2[0].y + triangle2[1].y + triangle2[2].y)/3
			}
			return;
		}
		else if (test == 2 || test == 3) {
			this.referenceFace = fl
			this.referencePoint = {
				x: (triangle2[0].x + triangle2[1].x + triangle2[2].x)/3,
				y: (triangle2[0].y + triangle2[1].y + triangle2[2].y)/3
			}
			return;
		}

		let triangleIn3 = this.faceTriangle(fl);
		let triangle3 = [this.vertices[triangleIn3[0]], this.vertices[triangleIn3[1]], this.vertices[triangleIn3[2]]];

		test = classifyPointTriangle(this.referencePoint, triangle3);
		if (test == 1) {
			this.referenceFace = fl
			this.referencePoint = {
				x: (triangle3[0].x + triangle3[1].x + triangle3[2].x)/3,
				y: (triangle3[0].y + triangle3[1].y + triangle3[2].y)/3
			}
			return;
		}
		else if (test == 2 || test == 3) {
			this.referenceFace = fl
			this.referencePoint = {
				x: (triangle3[0].x + triangle3[1].x + triangle3[2].x)/3,
				y: (triangle3[0].y + triangle3[1].y + triangle3[2].y)/3
			}
			return;
		}
		

	}

	updateReferenceFace2(fr,fl) {
		let triangleIn1 = this.faceTriangle(fr);
		let triangle1 = [this.vertices[triangleIn1[0]], this.vertices[triangleIn1[1]], this.vertices[triangleIn1[2]]];

		let test = classifyPointTriangle(this.referencePoint, triangle1);
		if (test == 1) {
			this.referenceFace = fr
			this.referencePoint = {
				x: (triangle1[0].x + triangle1[1].x + triangle1[2].x)/3,
				y: (triangle1[0].y + triangle1[1].y + triangle1[2].y)/3
			}
			return;
		}
		else if (test == 2 || test == 3) {
			this.referenceFace = fl
			this.referencePoint = {
				x: (triangle1[0].x + triangle1[1].x + triangle1[2].x)/3,
				y: (triangle1[0].y + triangle1[1].y + triangle1[2].y)/3
			}
			return;
		}

		let triangleIn2 = this.faceTriangle(fl);
		let triangle2 = [this.vertices[triangleIn2[0]], this.vertices[triangleIn2[1]], this.vertices[triangleIn2[2]]];

		test = classifyPointTriangle(this.referencePoint, triangle2);
		if (test == 1) {
			this.referenceFace = fl
			this.referencePoint = {
				x: (triangle2[0].x + triangle2[1].x + triangle2[2].x)/3,
				y: (triangle2[0].y + triangle2[1].y + triangle2[2].y)/3
			}
			return
		}
		else if (test == 2 || test == 3) {
			this.referenceFace = fl
			this.referencePoint = {
				x: (triangle2[0].x + triangle2[1].x + triangle2[2].x)/3,
				y: (triangle2[0].y + triangle2[1].y + triangle2[2].y)/3
			}
			return;
		}

		

	}

	delaunay(edge) {
		let v1, v2, v3, v4;
		let e1, e2, e3, e4;
		
		let e = this.edges[edge]
		v1 = e.ve
		e1 = e.en

		v3 = e.vb
		e3 = e.ep

		let eAux = this.edges[e1]
		if (eAux.vb == v1) {
			v2 = eAux.ve
			e2 = eAux.en
		}
		else {
			v2 = eAux.vb
			e2 = eAux.ep
		}

		eAux = this.edges[e3]
		if (eAux.vb == v3) {
			v4 = eAux.ve
			e4 = eAux.en
		}
		else {
			v4 = eAux.vb
			e4 = eAux.ep
		}

		if ((classifyPointCircle(this.vertices[v4], [this.vertices[v2], this.vertices[v1], this.vertices[v3]]) == 1 || classifyPointCircle(this.vertices[v4], [this.vertices[v2], this.vertices[v1], this.vertices[v3]]) == 0 ) && 
			(classifyPointCircle(this.vertices[v2], [this.vertices[v4], this.vertices[v3], this.vertices[v1]]) == 1 || classifyPointCircle(this.vertices[v2], [this.vertices[v4], this.vertices[v3], this.vertices[v1]]) == 0)) {
			return;
		}

		let facel = e.fl;
		let facer = e.fr;
	
		this.edges[edge]  = {
			vb: v4,
			ve: v2,
			fl: facel,
			fr: facer,
			ep: e4,
			en: e2,
		}


		this.faces[facel] = {
			e: edge
		}

		this.faces[facer] = {
			e: edge
		}
		
		if (this.edges[e1].vb == v1) {
			this.edges[e1].en = edge
			this.edges[e1].fr = facel
		}
		else {
			this.edges[e1].ep = edge
			this.edges[e1].fl = facel
		}

		if (this.edges[e2].vb == v2) {
			this.edges[e2].en = e3
			this.edges[e2].fr = facer
		}
		else {
			this.edges[e2].ep = e3
			this.edges[e2].fl = facer
		}

		if (this.edges[e3].vb == v3) {
			this.edges[e3].en = edge
			this.edges[e3].fr = facer
		}
		else {
			this.edges[e3].ep = edge
			this.edges[e3].fl = facer
		}

		if (this.edges[e4].vb == v4) {
			this.edges[e4].en = e1
			this.edges[e4].fr = facel
		}
		else {
			this.edges[e4].ep = e1
			this.edges[e4].fl = facel
		}
		
		this.vertices[v1].e = e1;
		this.vertices[v3].e = e3;

		if (this.edges[e1].fr != -1 && this.edges[e1].fl != - 1) this.delaunay(e1);
		if (this.edges[e2].fr != -1 && this.edges[e2].fl != - 1) this.delaunay(e2);
		if (this.edges[e3].fr != -1 && this.edges[e3].fl != - 1) this.delaunay(e3);
		if (this.edges[e4].fr != -1 && this.edges[e4].fl != - 1) this.delaunay(e4);
		
		
	}

	

	addPoint(p) {
        let f = this.point_location(p,0,-1);
		//let f = this.find_face(p)
		
		let v1,v2,v3,e1,e2,e3;
        let v = this.vertexIndex
        let e = this.edgesNum
        let fnew = this.facesNum
        
        if (f[0] == -1) {
			return;
		}

		//Point lies on EDGE!!!
        if (f[1] == 1) {
			f = f[0];
			let el = this.edgesNum;
			let fl = this.facesNum;
			this.vertices[this.vertexIndex] = {
				x: p.x,
				y: p.y,
				e: el	
			}
			
			let edg = this.searchEdge(f, p);
			let toConect = this.twoOtherVertices(edg);
			if (this.edges[edg].fl != -1) f = this.edges[edg].fl;

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

			//console.log("inserting new face " + (fl + 1));
			let t3 = [this.vertices[ve], this.vertices[toConect[1]], p];
			//console.log(ve, toConect[1], this.vertexIndex - 1);

			//console.log("inserting new face " + (fl + 1));
			let t4 = [p, this.vertices[vb], this.vertices[toConect[1]]];
			//console.log(this.vertexIndex - 1, ve, toConect[1]);


			//actHier2.addFaces2(t3, t4, fl + 1, fl + 2);
			return;
        }
        
		f = f[0]
        e1 = this.faces[f].e;
        if (this.edges[e1].fl == f) {
            v1 = this.edges[e1].ve
            v2 = this.edges[e1].vb
            e2 = this.edges[e1].ep
        }

        else {
            v1 = this.edges[e1].vb
            v2 = this.edges[e1].ve
            e2 = this.edges[e1].en
        }

        if (this.edges[e2].fl == f) {
            v3 = this.edges[e2].vb
            e3 = this.edges[e2].ep
        }

        else {
            v3 = this.edges[e2].ve
            e3 = this.edges[e2].en
        }

        this.vertices[v] = {
            x: p.x,
            y: p.y,
            e: e
        }

        this.edges[e] = {
            vb: v,
			ve: v1,
			fl: f,
			fr: fnew,
			ep: e + 2,
			en: e1,
        }

        this.edges[e + 1] = {
            vb: v,
			ve: v2,
			fl: fnew,
			fr: fnew + 1,
			ep: e,
			en: e2,
        }

        this.edges[e + 2] = {
            vb: v,
			ve: v3,
			fl: fnew + 1,
			fr: f,
			ep: e + 1,
			en: e3,
        }

        this.faces[f] = {
            e: e
        }

        this.faces[fnew] = {
            e: e + 1
        }

        this.faces[fnew + 1] = {
            e: e + 2
        }

        this.vertexIndex = this.vertexIndex + 1
        this.edgesNum = this.edgesNum + 3
        this.facesNum = this.facesNum + 2

        if (this.edges[e1].vb == v1) {
            this.edges[e1].fr = fnew
            this.edges[e1].en = e + 1
        }

        else {
            this.edges[e1].fl = fnew
            this.edges[e1].ep = e + 1
        }

        if (this.edges[e2].vb == v2) {
            this.edges[e2].fr = fnew + 1
            this.edges[e2].en = e + 2
        }

        else {
            this.edges[e2].fl = fnew + 1
            this.edges[e2].ep = e + 2
        }

        if (this.edges[e3].vb == v3) {
            this.edges[e3].fr = f
            this.edges[e3].en = e 
        }

        else {
            this.edges[e3].fl = f
            this.edges[e3].ep = e
        }

		if (this.edges[e1].fl != -1 && this.edges[e1].fr != -1) this.delaunay(e1)
		if (this.edges[e2].fl != -1 && this.edges[e2].fr != -1) this.delaunay(e2)
		if (this.edges[e3].fl != -1 && this.edges[e3].fr != -1) this.delaunay(e3)

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

function delEdgesPoint(vertex) {
	let ed = dcel.vertices[vertex].e
	let e1 = dcel.edges[ed].vb == vertex ? dcel.edges[ed].ep : dcel.edges[ed].en 

	while (e1 !== ed) {
		
		fright = dcel.edges[e1].vb == vertex ? dcel.edges[e1].fr : dcel.edges[e1].fl
		if (fright != -1) dcel.faces[fright].e = -1

		e1 = dcel.edges[e1].vb == vertex ? dcel.edges[e1].ep : dcel.edges[e1].en 
	}

	fright = dcel.edges[ed].vb == vertex ? dcel.edges[ed].fr : dcel.edges[ed].fl
	if (fright != -1) dcel.faces[fright].e = -1
}


function insideBoundary(ed, vertex, prev, next) {
	let otherVert = dcel.edges[ed].vb == vertex ? dcel.edges[ed].ve : dcel.edges[ed].vb 
	if (otherVert == prev || otherVert == next) return true;

	let det1 = determinantPoint2Segment(dcel.vertices[otherVert], dcel.vertices[prev], dcel.vertices[vertex])
	let det2 = determinantPoint2Segment(dcel.vertices[otherVert], dcel.vertices[vertex], dcel.vertices[next])

	if (det1 >= 0 && det2 >= 0) return true

	return false
}

function delEdges(vertex, prev, next) {
	let ed = dcel.vertices[vertex].e
	let e1 = dcel.edges[ed].vb == vertex ? dcel.edges[ed].ep : dcel.edges[ed].en;
	let elast = dcel.vertices[vertex].e;

	while (dcel.edges[e1].vb != prev && dcel.edges[e1].ve != prev) e1 = dcel.edges[e1].vb == vertex ? dcel.edges[e1].ep : dcel.edges[e1].en;

	while (dcel.edges[elast].vb != next && dcel.edges[elast].ve != next) elast = dcel.edges[elast].vb == vertex ? dcel.edges[elast].ep : dcel.edges[elast].en;
	
	e1 = dcel.edges[e1].vb == vertex ? dcel.edges[e1].ep : dcel.edges[e1].en;
	while (e1 != elast) {
		fright = dcel.edges[e1].vb == vertex ? dcel.edges[e1].fr : dcel.edges[e1].fl
		dcel.faces[fright].e = -1
		e1 = dcel.edges[e1].vb == vertex ? dcel.edges[e1].ep : dcel.edges[e1].en
	}

	if (!insideBoundary(e1, vertex, prev, next)) {
		fright = dcel.edges[e1].vb == vertex ? dcel.edges[e1].fr : dcel.edges[e1].fl
		dcel.faces[fright].e = -1
	}
}

function PruneBoundaries(boundaries) {

	max = dcel.vertexIndex;
	delEdgesPoint(max)
	delEdgesPoint(max + 1)
	delEdgesPoint(max + 2)

	let n;
	if (boundaries != null) n = boundaries.length
	else n = 0
	for (let i = 0; i < n; ++i) {
		ni = boundaries[i].length
		if (ni == 1) delEdgesPoint(boundaries[i][0])
		for (let j = 0; j < ni; ++j) {
			let prev, next;
			if (j == 0) prev = ni - 1;
			else prev = j - 1;

			if (j == ni - 1) next = 0
			else next = j + 1

			delEdges(boundaries[i][j], boundaries[i][prev], boundaries[i][next])
		}
	}

	let faces = dcel.facesNum;
	let outputTriangles = [];
	let j = 0
	for (i=0;i<faces;i++) {
		if (dcel.faces[i].e != -1) {
			outputTriangles[j] = dcel.faceTriangle(i); // Store INDICES, not points
			j += 1;
		}
	}
	
	return outputTriangles
}

function computeTriangulation(points, bounds) {
	
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
	dcel = new DCEL(triangle,n);
	hier = new Hierarchy(triangle, 0);

	let faces = 0;
	for(p in points) {
		if (p <  n) dcel.addPoint(points[p]);
	}
	faces = dcel.facesNum;

	
	return PruneBoundaries(bounds);
}



