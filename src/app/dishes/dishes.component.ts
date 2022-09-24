import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import {
  CategoriesService,
  DishesService,
} from '../_services/api.service';
declare var swal:any;

@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css'],
})
export class DishesComponent implements OnInit {

  dishes: Dish[] = [];
  categories: Category[] = [];
  selectedFile: File | null = null;
  addDish = false;

  filterDish = '';
  newDishCategories: Category[] = [];

  page_size: number = 4
  page_number: number = 1
  pageSizeOptions = [4,8,12,16,20,24,28,32]

  newDish = {
    name: '',
    descripcion: '',
    image: '',
    popularity: 0,
    status: false,
    categories: {}
  };

  hasBeenModified: boolean[] = [];

  constructor(
    private api: DishesService,
    private api2: CategoriesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDishes();
    this.loadCategories();
  }

  handlePage(e: PageEvent){
    this.page_size = e.pageSize;
    this.page_number = e.pageIndex+1;
  }

  //dado que si estas en 2a pagina, no te busca de la 1a (al reves si), recargamos
  changePage(){
    if(this.page_number !=1){
      window.location.reload();
    }
  }

  //compara les categ del plat amb la llista completa de categ, per tal que surtin checked a la llista
  compare(dish: Dish, category: Category): Category | undefined{
    return dish.categories.find((categoryDish: Category) => categoryDish.id === category.id)
  }

  changeImage(indexDish: any) {
    $("#dish"+indexDish).find(".uploadFile").trigger("click")

    // En cas que sigui el new Dish, no cal modificar estat array
    if(indexDish == "New") return

    this.hasBeenModified[indexDish] = true;
  }

  loadDishes() {
    console.log("laoding dishes")
    this.api.getDishes().subscribe(
      (response) => {
        console.log("loaded dishes")
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

    if (this.newDish.name != '' && this.selectedFile != null) {
      this.newDish.categories = llistaCat;

      this.api.postDish(this.newDish).subscribe(
        (response) => {
          /////
          this.updateDishImage(response.id,this.selectedFile)
          this.clearNewDish();
          this.addDish = false;
          swal("Plato creado!", {
            icon: "success",
            buttons: false,
            timer: 1300,
          });
          if (response == null) {
            swal("No se ha guardado el plato. Nombre repetido", {
              icon: "error",
              buttons: false,
              timer: 1300,
            });
          }
        },
        (error) => {
          swal("Error. Intentalo de nuevo", {
            icon: "error",
            buttons: false,
            timer: 1200,
          });
          console.log('ERROR REQUEST' + error.message);
        }
      );
    } else {
      swal("El plato no tiene imagen!", {
        icon: "error",
        buttons: false,
        timer: 1200,
      });
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
    swal({
      text: '¿Seguro que quieres cambiar el estado a Inactivo?',
      icon: 'warning',
      buttons: [true, "Si"],
    }).then((okay: boolean) => {
      if (okay) {
        this.api.deleteDish(id).subscribe(
          (response) => {
            this.loadDishes();
          },
          (error) => {
            console.log('ERROR REQUEST' + error.message);
          }
        );
      } else {
        return;
      }
    });
  }

  onFileChanged(event:any,dishId:any) {
    console.log("onFileChanged")
    this.selectedFile = <File>event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e : any) {
        console.log($("#dish"+dishId).find(".preview").attr("src"))
          $("#dish"+dishId).find(".preview").attr('src', e.target.result);
      }

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  update(index: number) {
    var llistaCat: any[] = []
    // Obtenim categories del dish
    var categories:any = $("#dish"+index).find(".categories").find("div")
    // Iterem sobre cada categoria per comprovar si esta seleccionada
    for (const c of categories) {
      var isChecked = $(c).find("input")[0].checked
      if(isChecked) {
        var idCat = c.getAttribute("cat-id");
        llistaCat.push({id: idCat})
      }
    }

    swal({
      text: '¿Seguro que quieres modificar los datos de este plato?',
      icon: 'warning',
      buttons: [true, "Si"],
    }).then((okay: boolean) => {
      if (okay) {
        this.dishes[index].categories = llistaCat
      // Es guarda un copia del dish que es vol actualitzar per poder netejar la llista i carregar spinner
      var dish = this.dishes[index]
      this.dishes = []
      this.api.putDish(dish).subscribe(
        (response) => {
          swal({
            text: "¡Plato actualizado! :)",
            icon: "success",
            button: false,
            timer: 1700
          });
          // No cal actualitzar la imatge (+temps de carrega) si no s'ha modificat
          if(this.hasBeenModified[index] && this.selectedFile != null) {
            this.updateDishImage(dish.id,this.selectedFile!)
          } else {
            this.dishes = [];
            this.loadDishes();
          }
        },
        (error) => {
          swal({
            text: "Fallo al modificar los datos. Lo sentimos, intentalo de nuevo",
            icon: "error",
            timer: 1000
          });
          console.log('ERROR REQUEST' + error.message);
        }
      );
      } else {
        return;
      }
    });

  }

  updateDishImage(dishID:number,f:any) {
      // Netejem ja l'array de dishes per que surti l'spinner
      this.dishes = [];
      this.api.updateDishImage(dishID,f).subscribe(
        (response) => {
          this.loadDishes();
        },
        (error) => {
          // Es posa a l'error per si s'ha cridat updateDishImatge() o save()
          this.dishes = [];
          this.loadDishes();
          console.log('ERROR REQUEST' + error.message);
        }
      );
      this.selectedFile = null;
  }
/*
  orderBy(camp:string) {
    if(camp == "popularidad") {
      console.log("coorecte")
      var d = this.dishes
      this.dishes = []
      d.sort((a, b) => {
        if (a.popularity > b.popularity) {
          return 1;
        } else if (a.popularity < b.popularity) {
          return -1;
        } else {
          return 0;
        }
      });
      this.dishes = d
    }
  }
  */

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


