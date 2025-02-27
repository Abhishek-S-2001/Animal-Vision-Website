import GUI from "lil-gui";
import { ArrowHelper, AxesHelper, BoxHelper, CameraHelper, Group, PointLight, SkeletonHelper, TOUCH } from "three";
import * as THREE from "three";
import Experience from "../Experience";
import EventEmitter from "../Utils/EventEmitter";
import Database from "../../DataBase/Datafetch.js";

export default class earth extends EventEmitter{
    constructor(){
        super()

        this.experience = new Experience
        this.experience.camera.instance.position.set(0, 0, 5)
        this.groupEarth = new Group()
        this.experience.light.intensity = 0.1
        this.experience.scene.add(this.groupEarth)
        this.pointLight = new PointLight("white", 5)
        this.pointLight.position.set(0, 15, 4)
        this.groupEarth.add(this.pointLight)
        this.groupEarth.position.set(1.5,0,-1)
        console.log(this.experience.camera.instance)
        
        // when resources (model) is being loaded
        const model = this.experience.resources.items.earth.scene
        this.groupEarth.add(model)
        this.groupEarth.rotation.x = -Math.PI*0.5 
        this.groupEarth.rotation.z = Math.PI*0.9 
        this.LocationPointer()

        // this.experience.resources.on('ready', () =>{
        //     const model = this.experience.resources.items.earth.scene
        //     this.groupEarth.add(model)
        //     this.groupEarth.rotation.x = -Math.PI*0.5 
        //     this.groupEarth.rotation.z = Math.PI*0.9 
        //     this.LocationPointer()
        // })
        // to stop the camera control 
        this.experience.camera.controls.enabled = false

        // control to rotate earth on its axis
        this.earthControls()  
        
        // this to create details
        this.earthDetail()
    }

    LocationPointer(){
        const geometry = new THREE.ConeGeometry( 0.06, 0.2, 4, 1)
        const material = new THREE.MeshBasicMaterial( {color: 0xffff00} )
        const cone = new THREE.Mesh( geometry, material )
        cone.rotation.z = Math.PI
        cone.rotation.y = Math.PI * 0.25
        cone.rotateOnWorldAxis(new THREE.Vector3(1,0,0), (Math.PI / 180) * 66)
        cone.rotateOnWorldAxis(new THREE.Vector3(0,0,1),  2*Math.PI + (Math.PI / 180) * 105)
        cone.translateY(-1.2)        
        this.groupEarth.children[1].add(cone)
        console.log(this.groupEarth.children[1]) 
    }

    earthControls(){

        let isdragging = false
        let previousMousePosition = {
            x: 0,
            y: 0
        }

        addEventListener("mousedown", ()=>{
            isdragging = true
        })
        addEventListener("mouseup", ()=>{
            isdragging = false
        })
        addEventListener("mousemove", (event)=>{
            let deltaMove = {
                x: event.offsetX-previousMousePosition.x,
                y: event.offsetY-previousMousePosition.y
            }
            if (isdragging){

                var deltaRotationQuaternion = new THREE.Quaternion()
                    .setFromEuler(new THREE.Euler(
                        -(deltaMove.y * 0.02)*( Math.PI / 180 ),
                        0,
                        (deltaMove.x * 0.8)*( Math.PI / 180 ),
                        'XYZ'
                    ))
                this.groupEarth.children[1].quaternion
                .multiplyQuaternions(deltaRotationQuaternion, 
                    this.groupEarth.children[1].quaternion)                
            }
            previousMousePosition = {
                x: event.offsetX,
                y: event.offsetY
            }
        })

    }

    earthDetail(){

        const width = window.innerWidth
        const height = window.innerHeight
        // class to get the data from the database class 
        const DatabaseClass = new Database(0)
        const DataBaseQuery = DatabaseClass.getData()

        // to create element and add it in the body 
        let divdetail = document.createElement("div")
        let details = document.createElement("h1")
        let Name = document.createElement("div")
        let divLocation = document.createElement("div")
        let divContinent = document.createElement("div")
        let divVenomous = document.createElement("div")
        let divLength = document.createElement("div")
        let divDescription = document.createElement("div")
        let Image = document.createElement("img")

        
        divdetail.style = `position: absolute; width:${width*0.20}px; left:${width*0.05}px;top:${height*0.05}px;
        border-width:2px;
        border-style:solid;
        border-color:yellow;
        border-radius:12px;`

        details.style = `color: white; text-align: center; padding:10px`
        details.id = "divhead"
        details.innerHTML = "Details"
        divdetail.appendChild(details)
        
        Image.style = `border-radius: 12px; width:90%; align: center;display: block;margin-left: auto;margin-right: auto;`
        Image.id = 'ClassImage'
        Image.src = this.experience.image
        divdetail.appendChild(Image)


        
        
        


        
        // divName.style = `color: white;`
        // divName.id = 'ClassName'
        // divName.innerHTML = "Name: "+DataBaseQuery.name

        
        
        // divLocation.style = `position: absolute; color: white; left:${(width*0.1)}px; top:${(height*0.15)+20}px`
        // divLocation.id = 'ClassLocation'
        // divLocation.innerHTML = "Location: "+DataBaseQuery.location



        document.body.appendChild(divdetail)
        // document.body.appendChild(divLocation)
        // document.body.appendChild(Image)

        //console.log(this.experience.image)
    }
}