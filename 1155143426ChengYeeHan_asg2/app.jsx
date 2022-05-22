/*
Name: Cheng Yee Han
SID: 1155143426
*/

const data = [
    {filename: "cuhk-2013.jpg", year: 2013, remarks: "Sunset over CUHK"},
    {filename: "cuhk-2017.jpg", year: 2017, remarks: "Bird's-eye view of CUHK"},
    {filename: "sci-2013.jpg", year: 2013, remarks: "The CUHK Emblem"},
    {filename: "shb-2013.jpg", year: 2013, remarks: "The EngineeringBuildings"},
    {filename: "stream-2009.jpg", year: 2009, remarks: "Nature hidden in the campus"},
    ];
    
const {BrowserRouter, Routes, Route, Link} = ReactRouterDOM;
const {useMatch, useParams, useLocation} = ReactRouterDOM;

class App extends React.Component{
    render(){
        return(
            <>
            <Title name={this.props.name}/>
            <BrowserRouter>
                <div>
                    <ul>
                        <LongLink to="/" label="Home" />
                        <LongLink to="/gallery" label="Images" />
                        <LongLink to="/slideshow" label="Slideshow" />

                    </ul>
                    <hr/>

                    <Routes>
                        <Route path="/" element={<Home/>} />
                        <Route path="/gallery" element={<Gallery/>} />
                        <Route path="/slideshow" element={<Slideshow/>} />
                        <Route path="*" element={<NoMatch/>} />
                    </Routes>
                </div>
            </BrowserRouter>
            
            </>
        );
    }
}
function LongLink({label, to}) {
    let match = useMatch({
        path: to
    });
    return (
    <li className={match ? "active" : ""}>
    {match && "> "}
    <Link to={to}>{label}</Link>
    </li>
    );
}
function NoMatch() {
    let location = useLocation();
    return (
    <div>
        <h3>
        No match for <code>{location.pathname}</code>
        </h3>
    </div>
    );
}

class Home extends React.Component {
    render() {
      return(
        <>
            <h2 >Component Diagram:</h2>
            <img src="diagram.png"/>
        </>
      );

    }
  }
 
class Slideshow extends React.Component{
    constructor(props) {
        super(props);
        this.state = {  currentImageID: 0, currentInterval:250, };
        {/* this syntax should only be used
        in the constructor, and otherwise
        this.setState() must be used */}
    }
    handleStart(index, e) {
      
        if(this.state.currentImageID<4)
            this.setState({currentImageID: ++index});   
        else{
            this.setState({currentImageID: 0});
            
        }
    }
    
    handleStop(){
        this.setState({currentInterval: 250});  
    }

    handleSlower() {
        let interval= this.state.currentInterval;
        this.setState({currentInterval: interval+250});
    }
    handleFaster() {
        let interval= this.state.currentInterval;
        if (interval>= 500)
            this.setState({currentInterval: interval-250});
    }
    render(){
        var id;
        return(
            
            <>
            <h2>Slideshow</h2>
                <button onClick={()=>{clearInterval(this.id);this.id=setInterval((e)=>this.handleStart(this.state.currentImageID, e),this.state.currentInterval);}} >Start slideshow</button>
                <button onClick={()=>{clearInterval(this.id);this.handleStop();}}>Stop slideshow</button>
                <button onClick={()=>{clearInterval(this.id);this.handleSlower();this.id=setInterval((e)=>this.handleStart(this.state.currentImageID, e),this.state.currentInterval);}}>slower</button>
                <button onClick={()=>{clearInterval(this.id);this.handleFaster();this.id=setInterval((e)=>this.handleStart(this.state.currentImageID, e),this.state.currentInterval);}}>faster</button>
            <br/>
            <div className="Slide" style={{display:this.state.currentImageID==0 ? "block":"none"}}>
                <img src={"images/"+data[0].filename}  />
                <h6 >{data[0].filename}</h6>
            </div>
            <div className="Slide" style={{display:this.state.currentImageID==1 ? "block":"none"}}>
                <img src={"images/"+data[1].filename}  />
                <h6 >{data[1].filename}</h6>
            </div>
            <div className="Slide" style={{display:this.state.currentImageID==2 ? "block":"none"}}>
                <img src={"images/"+data[2].filename}  />
                <h6 >{data[2].filename}</h6>
            </div>
            <div className="Slide" style={{display:this.state.currentImageID==3 ? "block":"none"}}>
                <img src={"images/"+data[3].filename}  />
                <h6 >{data[3].filename}</h6>
            </div>
            <div className="Slide" style={{display:this.state.currentImageID==4 ? "block":"none"}}>
                <img src={"images/"+data[4].filename}  />
                <h6 >{data[4].filename}</h6>
            </div>
            </>
            );
    }
}

  
class Title extends React.Component{
    render(){
        return(
            <header className="bg-warning">
                <h1 className="display-4 text-center">{this.props.name}</h1>
            </header>
        );
    }
}
class Gallery extends React.Component{
    render(){
        return(
            <main className="container">
                {data.map((file,index) => <FileCard i={index} key={index}/>)}
            </main>
        );
    }
}
class FileCard extends React.Component{
    constructor(props) {
        super(props);
        this.state = { selected: -1 };
        {/* this syntax should only be used
        in the constructor, and otherwise
        this.setState() must be used */}
    }
    handleMouse(index, e) {
        if (this.state.selected!= index)
            this.setState({selected: index});
        else
            this.setState({selected: -1});
    }

    render(){
        let i = this.props.i;
        return(
            <div className="card d-inline-block m-2" style={{width:this.state.selected==i ? '220px':200}} onMouseOver={(e) => this.handleMouse(i,e)} onMouseOut={(e) => this.handleMouse(i,e)}>
                <img src={"images/"+data[i].filename}className="w-100" />
                <div className="card-body">
                    <h6 className="card-title"> {data[i].filename}</h6>
                    <p className="card-text">{data[i].year}</p>
                    { this.state.selected==i && <p className="card-text">{data[i].remarks}</p> }
                </div>
            </div>
        )
    }
}


ReactDOM.render(
    <App name="CUHK Pictures"/>,
    document.querySelector("#app")
);



