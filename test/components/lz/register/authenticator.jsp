<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<%@ page contentType="text/xml" %>
<%@page import="java.util.*" %>
<%@page import="java.io.*" %>
<%!
    private boolean mIsInited = false;
    private String mDataDir = null;
    private String mUsersFile;
    private HashMap mUsers = null;

    private class RegistrationData implements Serializable {
        private String mSalutation;
        private String mName;
        private String mCompany;
        private String mEmail;
        private String mUsername;
        private String mPassword;
        private String mWebsite;
        private String mPhone;
        private String mReferer;
        private Boolean mSendNews;

        public RegistrationData(String salutation, String name, String company,
                                String email, String username, String password,
                                String website, String phone, String referer,
                                boolean sendNews) throws Exception
        {
            register(salutation, name, company, email, username, password,
                     website, phone, referer, sendNews);
        }

        public RegistrationData(HttpServletRequest req) throws Exception {
            String sendNews = req.getParameter("sendnews");
            register(req.getParameter("salutation"),
                     req.getParameter("name"),
                     req.getParameter("company"),
                     req.getParameter("email"),
                     req.getParameter("username"),
                     req.getParameter("password"),
                     req.getParameter("website"),
                     req.getParameter("phone"),
                     req.getParameter("referer"),
                     (sendNews != null && "true".equals(sendNews))
            );
        }

        public String toXML() {
            return 
                "<registration username=\"" + mUsername + "\">\n" +
                "<salutation>" + mSalutation + "</salutation>\n" +
                "<name>" + mName + "</name>\n" +
                "<company>" + mCompany + "</company>\n" +
                "<email>" + mEmail + "</email>\n" +
                "<password>" + mPassword + "</password>\n" +
                (mWebsite != null ? "<website>" + mWebsite + "</website>\n" : "") +
                (mPhone != null ? "<phone>" + mPhone + "</phone>\n" : "") +
                (mReferer != null ? "<referer>" + mReferer + "</referer>\n" : "") +
                "<sendnews>" + mSendNews + "</sendnews>\n" +
                "</registration>\n";
        }

        private boolean isEmpty(String str) {
            return (str == null || str.equals(""));
        }

        public void register(String salutation, String name, String company,
                             String email, String username, String password,
                             String website, String phone, String referer,
                             boolean sendNews) throws Exception
        {
            HashSet missing  = new HashSet();

            // required parameters
            if (isEmpty(salutation)) missing.add("salutation");
            if (isEmpty(name))       missing.add("name");
            if (isEmpty(company))    missing.add("company");
            if (isEmpty(email))      missing.add("email");
            if (isEmpty(username))   missing.add("username");
            if (isEmpty(password))   missing.add("password");

            if (missing.size() != 0) {
                StringBuffer message = new StringBuffer("required fields missing: ");
                Iterator iter = missing.iterator();
                while (iter.hasNext()) {
                    message.append((String)iter.next()).append(", ");
                }
                throw new Exception(message.toString());
            }

            mSalutation = salutation;
            mName = name;
            mCompany = company;
            mEmail = email ;
            mUsername = username;
            mPassword = password;
            mWebsite = website;
            mPhone = phone;
            mReferer = referer;
            mSendNews = new Boolean(sendNews);
        }
    }

    private void initialize(HttpServletRequest req, HttpServletResponse res, 
                            PageContext pc, JspWriter out) throws IOException
    {
        res.setHeader("Expires", "Fri, 05 Oct 2001 00:00:00 GMT");
        if (! mIsInited) { // read file only when JSP is first instantiated
            out.println("<!-- initialize JSP -->");
            setDataDirectory(req, pc, out);
            readUsers(out);
            mIsInited = true;
        }
        //out.println("<!-- data dir: " + mDataDir + " -->");
        //out.println("<!-- data file: " + mUsersFile + " -->");
    }

    private void setDataDirectory(HttpServletRequest req, PageContext pc,
        JspWriter out) throws IOException{

        String servletPath = req.getServletPath();
        String realPath = pc.getServletContext().getRealPath(servletPath);
        File file = new File(realPath);
        File parent = file.getParentFile();
        File dataDir = new File(parent.toString() + File.separatorChar + "data");
        dataDir.mkdir();

        mDataDir = dataDir.toString();
        mUsersFile = mDataDir + File.separatorChar + "users.dat";
    }

    synchronized private void readUsers(JspWriter out) throws IOException {
        try {
            ObjectInputStream istream =
                new ObjectInputStream(new FileInputStream(mUsersFile));
            mUsers = (HashMap)istream.readObject();
            istream.close();
        } catch (FileNotFoundException e) {
            out.println("<!-- " + mUsersFile + " not found -->");
        } catch (ClassNotFoundException e) {
            out.println("<!-- " + mUsersFile + ": class not found -->");
        }
        if (mUsers == null) {
            mUsers = new HashMap();
        }
    }

    synchronized private void writeUsers(JspWriter out) throws IOException {
        //out.println("<!-- write mUsers: " + mUsers + " -->");
        try {
            ObjectOutputStream ostream = 
                new ObjectOutputStream(new FileOutputStream(mUsersFile));
            ostream.writeObject(mUsers);
            ostream.close();
        } catch (FileNotFoundException e) {
            out.println("<!-- could not write " + mUsersFile + " -->");
        }
    }

    synchronized private void login(HttpServletRequest req, HttpServletResponse res,
                                    JspWriter out) throws IOException {
        String usr = req.getParameter("usr");
        String pwd = req.getParameter("pwd");
        if (usr == null) usr = "";
        if (pwd == null) pwd = "";

        boolean ok = false;
        String errorMsg = "Username " + usr + " does not exist";
        RegistrationData rd  = (RegistrationData)mUsers.get(usr);
        if (rd != null) {
            errorMsg = "Wrong password";
            ok = rd.mPassword.equals(pwd);
        } 

        if (ok) {
            HttpSession session = req.getSession();
            session.setAttribute("rd", rd);
            out.println("<status code=\"success\" rt=\"login\" />");
            out.println(rd.toXML());
        } else {
            out.println("<status code=\"fail\" rt=\"login\" message=\"" + errorMsg + "\"/>");
        }
    }

    private void logout(HttpServletRequest req, HttpServletResponse res,
                        JspWriter out) throws IOException {
        HttpSession session = req.getSession();
        session.removeAttribute("rd");
        out.println("<status code=\"success\" rt=\"logout\" />");
    }

    synchronized private void register(HttpServletRequest req, HttpServletResponse res,
                                       JspWriter out) throws IOException {
        try {
            String username = req.getParameter("username");
            if (username == null) {
                out.println("<status code=\"fail\" rt=\"register\" message=\"username missing\"/>");
                return;
            } else if (mUsers.containsKey(username)) {
                out.println("<status code=\"fail\" rt=\"register\" " +
                            "message=\"The username " + username + " is not available\"/>");
                return;
            }

            RegistrationData rd = new RegistrationData(req);
            mUsers.put(rd.mUsername, rd);
            writeUsers(out);
            out.println("<status code=\"success\" rt=\"register\" />");
            out.println(rd.toXML());
        } catch (Exception e) {
            out.println("<status code=\"fail\" rt=\"register\" message=\"" + e.getMessage() + "\"/>");
        }
    }

    private void checksession(HttpServletRequest req, HttpServletResponse res,
                              JspWriter out) throws IOException {
        HttpSession session = req.getSession();
        RegistrationData rd = (RegistrationData)session.getAttribute("rd");
        if (rd != null) {
            out.println("<status code=\"success\" rt=\"checksession\" />");
            out.println(rd.toXML());
        } else { 
            out.println("<status code=\"fail\" rt=\"checksession\"/>");
        }
    }

    synchronized private void clear(HttpServletRequest req, HttpServletResponse res,
                                    JspWriter out) throws IOException {
        Iterator iter = mUsers.values().iterator();
        while (iter.hasNext()) {
            iter.next();
            iter.remove();
        }
        writeUsers(out);
        out.println("<!-- write mUsers: " + mUsers + " -->");
        out.println("<status code=\"success\" rt=\"clear\" />");
    }

    synchronized private void list(HttpServletRequest req, HttpServletResponse res,
                                   JspWriter out) throws IOException {
        out.println("<status code=\"success\" rt=\"list\" />");

        Iterator iter = mUsers.keySet().iterator();
        out.println("<registrations>");
        while (iter.hasNext()) {
            RegistrationData rd = (RegistrationData)mUsers.get((String)iter.next());
            out.println(rd.toXML());
        }
        out.println("</registrations>");
    }

    synchronized private void populate(HttpServletRequest req, HttpServletResponse res,
                                       JspWriter out) throws IOException {
        try {
            for (int i=0; i < 5; i++) {
                String username = "username" + i;
                RegistrationData rd = 
                    new RegistrationData("mr", "name" + i, "company" + i, 
                        "email" + i, username, "password" + i, 
                        "website" + i, "phone" + i, "referer" + i, false);
                mUsers.put(username, rd);
            }

            writeUsers(out);

        } catch (Exception e) { 
            out.println("<!-- populate exception: " + e.getMessage() + " -->");
        }

        out.println("<status code=\"success\" rt=\"populate\" />");
    }

    private void unknown(HttpServletRequest req, HttpServletResponse res,
                         JspWriter out) throws IOException {
        out.println("<status rt=\"unknown\" msg=\"unknown request type\" />");
    }
%>
<%
    initialize(request, response, pageContext, out);

    String rt = request.getParameter("rt");
    if (rt == null) rt = "";

    out.println("<authentication>");
    if (rt.equals("login")) {

        login(request, response, out);

    } else if (rt.equals("logout")) {

        logout(request, response, out);

    } else if (rt.equals("register")) {

        register(request, response, out);

    } else if (rt.equals("checksession")) {

        checksession(request, response, out);

    } else if (rt.equals("clear")) {

        // clear user database (administrative request)
        clear(request, response, out);

    } else if (rt.equals("populate")) {

        // populate database with five usernames (administrative request)
        populate(request, response, out);

    } else if (rt.equals("list")) {

        // list database (administrative request)
        list(request, response, out);

    } else {

        unknown(request, response, out);

    }
    out.println("</authentication>");

%>
