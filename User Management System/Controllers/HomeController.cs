using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace User_Management_System.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Home()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult ManageUsers()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult Roles()
        {

            return View();
        }

        public ActionResult Profile()
        {

            return View();

        }

       

        public ActionResult Reports()
        {

            return View();

        }

        public ActionResult Login()
        {

            return View();

        }

        public ActionResult Logout()
        {
            // Sign out the user
            System.Web.Security.FormsAuthentication.SignOut();

            // Redirect to the home page (or login page)
            return RedirectToAction("Login", "Home");
        }
    }
}