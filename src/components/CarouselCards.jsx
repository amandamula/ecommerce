import React, { Component } from "react";
import CardNova from "../components/CardNova";
import axios from "axios";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./css/CarouselCards.css";


class ContainerCards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      codi: "CAMAPACK",
      productes: [],
      codiFam: "100001",
    };
  }

  async componentDidMount() {

    const lang = localStorage.getItem("idioma");

    const respFiltrat = await axios.get(
      process.env.REACT_APP_API_DOMAIN + "/api/ecomfront/articles",
      {
        params: {
          query: `familia.codi=ic=${this.props.codiFam};bloquejat==false`,
          page: 0,
          size: 100,
          lang: lang,
        },
        headers: {
          Authorization: `${localStorage.getItem(
            "tokenType"
          )} ${localStorage.getItem("resposta")}`,
        },
      }
    );

    const productesFiltrats = respFiltrat.data;
    this.setState({ productes: productesFiltrats._embedded.articles });
  }

  
  render() {
    const that = this;

    const c = this.props.codi;
    return (
      <div>
        <div className="container">
   
            <Carousel
              additionalTransfrom={0}
              arrows={true}
              renderButtonGroupOutside={true}
              autoPlaySpeed={3000}
              centerMode={false}
              className=""
              containerClass="container-with-dots"
              dotListClass=""
              draggable
              focusOnSelect={false}
              itemClass=""
              keyBoardControl
              minimumTouchDrag={80}
              renderDotsOutside={false}
              responsive={{
                desktop: {
                  breakpoint: {
                    max: 3000,
                    min: 1024,
                  },
                  items: 4,
                  partialVisibilityGutter: 40,
                },
                mobile: {
                  breakpoint: {
                    max: 464,
                    min: 0,
                  },
                  items: 1,
                  partialVisibilityGutter: 30,
                },
                tablet: {
                  breakpoint: {
                    max: 1024,
                    min: 464,
                  },
                  items: 3,
                  partialVisibilityGutter: 30,
                },
              }}
              showDots={false}
              sliderClass=""
              slidesToSlide={1}
              swipeable
            >
              {this.state.productes.map(function (articles) {
                if (articles.codi != c) {
                  return (
                    <div className="container" key={articles.id}>
                      <CardNova
                        key={articles.id}
                        decimalsPreuCataleg={articles.decimalsPreu}
                        decimalsPreuSenseIvaCataleg={articles.decimalsPreuIva}
                        descripcio={articles.descripcio}
                        desc={articles.descripcioCurta}
                        id={articles.id}
                        imatge={articles.rutaInforme}
                        ivaId={articles.iva.id}
                        preu={articles.preuAmbIva}
                        preuCataleg={articles.fixedPreuAmbIva}
                        preuSenseIvaCataleg={articles.fixedPvp}
                        preuSenseIva={articles.pvp}
                        codi={articles.codi}
                        afegirCistella={that.props.afegirCistella}
                        familia={articles.familia.description}
                      />
                    </div>
                  );
                }
              })}
            </Carousel>
          </div>
        </div>
   
    );
  }
}



export default ContainerCards;
