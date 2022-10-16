/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.myceo.app.controller;


import com.myceo.app.models.Empresa;
import com.myceo.app.services.IEmpresaService;
import java.util.HashMap;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 *
 * @author anfel
 */

@RestController
@RequestMapping("/empresa")
@CrossOrigin(origins = {"*"})
public class EmpresaRestController {

    @Autowired
    private IEmpresaService empresaService;

    @GetMapping()
    public List<Empresa> list() {
        return empresaService.findAll();
    }

    @GetMapping("/clientes/page/{page}")
    @ResponseStatus(HttpStatus.OK)
    public Page<Empresa> index(@PathVariable Integer page) {
        Pageable pageable = PageRequest.of(page, 4);
        return empresaService.findAll(pageable);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> get(@PathVariable Integer id) {
        Empresa empresa = null;
        Map<String, Object> response = new HashMap<>();

        try {
            empresa = empresaService.findById(id);
        } catch (DataAccessException e) {
            response.put("mensaje", "Error al realizar la consulta en la base de datos");
            response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (empresa == null) {
            response.put("mensaje", "La empresa ID: ".concat(id.toString().concat(" no existe en la base de datos!")));
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<Empresa>(empresa, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> put(@Valid @RequestBody Empresa empresa, BindingResult result, @PathVariable Integer id) {
        Empresa empresaActual = empresaService.findById(id);

        Empresa empresaUpdated = null;

        Map<String, Object> response = new HashMap<>();

        if (result.hasErrors()) {

            List<String> errors = result.getFieldErrors()
                    .stream()
                    .map(err -> "El campo '" + err.getField() + "' " + err.getDefaultMessage())
                    .collect(Collectors.toList());

            response.put("errors", errors);
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.BAD_REQUEST);
        }

        if (empresaActual == null) {
            response.put("mensaje", "Error: no se pudo editar, la Empresa ID: "
                    .concat(id.toString().concat(" no existe en la base de datos!")));
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);
        }

        try {

            empresaActual.setTipoEmpresa(empresa.getTipoEmpresa());
            empresaActual.setNitEmpresa(empresa.getNitEmpresa());
            empresaActual.setCiudadEmpresa(empresa.getCiudadEmpresa());
            empresaActual.setTelefonoEmpresa(empresa.getTelefonoEmpresa());
            empresaActual.setEmailEmpresa(empresa.getEmailEmpresa());
            empresaUpdated = empresaService.save(empresaActual);

        } catch (DataAccessException e) {
            response.put("mensaje", "Error al actualizar la empresa en la base de datos");
            response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        response.put("mensaje", "El cliente ha sido actualizado con éxito!");
        response.put("empresa", empresaUpdated);

        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.CREATED);
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody Empresa empresa, BindingResult result) {
        Empresa empresanew = null;
        Map<String, Object> response = new HashMap<>();
        System.out.println(empresa.getNitEmpresa());
        if (result.hasErrors()) {

            List<String> errors = result.getFieldErrors()
                    .stream()
                    .map(err -> "El campo '" + err.getField() + "' " + err.getDefaultMessage())
                    .collect(Collectors.toList());

            response.put("errors", errors);
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.BAD_REQUEST);
        }

        try {
            empresanew = empresaService.save(empresa);
        } catch (DataAccessException e) {
            response.put("mensaje", "Error al realizar el insert en la base de datos");
            response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        response.put("mensaje", "la empresa ha sido creado con éxito!");
        response.put("empresa", empresanew);
        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();

        try {
            //Cliente cliente = clienteService.findById(id);
            empresaService.delete(id);
        } catch (DataAccessException e) {
            response.put("mensaje", "Error al eliminar la empresa de la base de datos");
            response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        response.put("mensaje", "La empresa se ha eliminado con éxito!");

        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.OK);
    }

}
