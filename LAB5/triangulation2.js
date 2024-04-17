class DCEL {
    constructor(tri, n) {
        this.vertices = {}
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

        this.edges = {}
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


    addPoint(p) {
        let f = this.find_face(p);
        let v1,v2,v3,e1,e2,e3;
        let v = this.vertexIndex
        let e = this.edgesNum
        let fnew = this.facesNum
        
        if (f[0] == -1) {
			console.log("jaja :(")
			return;
		}

        if (f[1] == 1) {
            console.log("jaja?")
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

		if (this.edges[e1].fl != -1 && this.edges[e1].fr != -1) this.delauny(e1)
		if (this.edges[e2].fl != -1 && this.edges[e2].fr != -1) this.delauny(e2)
		if (this.edges[e3].fl != -1 && this.edges[e3].fr != -1) this.delauny(e3)
    }
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

	let faces = 0;
	for(p in points) {
		if (p <  90) dcel.addPoint(points[p]);
	}
	faces = dcel.facesNum;
	
	let outputTriangles = new Array(faces); 
	for (i=0;i<faces;i++) {
		outputTriangles[i] = dcel.faceTriangle(i); // Store INDICES, not points
	}

	return outputTriangles;
}