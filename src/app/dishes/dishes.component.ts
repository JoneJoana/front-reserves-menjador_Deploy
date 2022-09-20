import { useAnimation } from '@angular/animations';
import { NgForOf } from '@angular/common';
import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import {
  CategoriesService,
  DishesService,
  OrdersService,
} from '../_services/api.service';

@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css'],
})
export class DishesComponent implements OnInit {

  admin: boolean = true;
  dishes: Dish[] = [];
  categories: Category[] = [];
  selectedFile: File | null = null;
  addDish = false;
  imgURL: any;

  newDishCategories: Category[] = [];

  newDish = {
    name: '',
    descripcion: '',
    image: '',
    popularity: 0,
    status: false,
    categories: {}
  };

  visibilityImg: boolean[] = [];
  visibilityFormFile: boolean[] = [];

  constructor(
    private api: DishesService,
    private api2: CategoriesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDishes();
    this.loadCategories();
  }

  //compara les categ del plat amb la llista completa de categ, per tal que surtin checked a la llista
  compare(dish: Dish, category: Category): Category | undefined{
    return dish.categories.find((categoryDish: Category) => categoryDish.id === category.id)
  }

  changeVisibility(indexDish: number) {
    this.visibilityFormFile[indexDish] = true;
    this.visibilityImg[indexDish] = false;
  }

  loadDishes() {
    this.api.getDishes().subscribe(
      (response) => {
        this.dishes = response;
      },
      (error) => {
        console.log('ERROR REQUEST');
      }
    );

  }

  loadCategories() {
    this.api2.getCategories().subscribe(
      (response) => {
        this.categories = response;
      },
      (error) => {
        console.log('ERROR REQUEST');
      }
    );
  }


  add() {
    this.addDish = true;
  }

  save() {
    var llistaCat: any[] = [];
    var categories:any = $(".checkNewdish").find("input");
    console.log("LLISTA INPUTS: "+categories)
    // Iterem sobre cada categoria per comprovar si esta seleccionada
    for (let c of categories) {
      var isChecked = $(c)[0].checked
      console.log("categ "+c.name+" checkeada?"+isChecked)
      if(isChecked) {
        var idCat = c.getAttribute("cat-id");
        llistaCat.push({id: idCat})
        console.log("LLISTA CATEG CHECKED: "+llistaCat)
      }
    }

    if (this.newDish.name != '') {
      this.newDish.categories = llistaCat;

      this.api.postDish(this.newDish).subscribe(
        (response) => {
          this.dishes = response;
          this.loadDishes();
          this.clearNewDish();
          this.addDish = false;
          if (response == null) {
            alert('No sha guardat el plat. Nom repetit');
          }
        },
        (error) => {
          console.log('ERROR REQUEST' + error.message);
        }
      );
    } else {
      console.log('El nom esta buit. No sha guardat.');
    }
  }

  cancel() {
    this.addDish = false;
    this.clearNewDish();
  }

  clearNewDish() {
    this.newDish = {
      name: '',
      descripcion: '',
      image: '',
      popularity: 0,
      status: false,
      categories: [],
    };
  }

  delete(id: number) {
    if(confirm('¿Seguro que quieres cambiar el estado a Inactivo?')){
      this.api.deleteDish(id).subscribe(
        (response) => {
          this.loadDishes();
        },
        (error) => {
          console.log('ERROR REQUEST' + error.message);
        }
      );
    }

  }

  onFileChanged(event:any) {
    console.log("onFileChanged")
    this.selectedFile = <File>event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e : any) {
          $('#preview').attr('src', e.target.result);
      }

      reader.readAsDataURL(event.target.files[0]);
  }
  }

  update(id: number) {
    var llistaCat: any[] = []
    // Obtenim categories del dish
    var categories:any = $("#dish"+id).find(".categories").find("div")
    // Iterem sobre cada categoria per comprovar si esta seleccionada
    for (const c of categories) {
      var isChecked = $(c).find("input")[0].checked
      if(isChecked) {
        var idCat = c.getAttribute("cat-id");
        llistaCat.push({id: idCat})
      }
    }

    // Pujar imatge plat
    const uploadImageData:FormData = new FormData();
    uploadImageData.append('imageFile', this.selectedFile!, this.selectedFile!.name);

    if(confirm('¿Seguro que quieres modificar los datos de este plato?')){
      this.dishes[id].categories = llistaCat

      this.api.putDish(this.dishes[id],uploadImageData).subscribe(
        (response) => {
          this.dishes = [];
          if(this.dishes.length == 0)
          this.loadDishes();
        },
        (error) => {
          console.log('ERROR REQUEST' + error.message);
        }
      );
    }
  }
}

export interface Dish {
  id: number;
  name: string;
  descripcion: string;
  image: any;
  popularity: number;
  status: boolean;
  categories: Category[];
}

export interface Category {
  id: number;
  name: string;
}

