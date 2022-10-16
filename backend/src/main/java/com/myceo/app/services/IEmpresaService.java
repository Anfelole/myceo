/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.myceo.app.services;

import com.myceo.app.models.Empresa;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 *
 * @author anfel
 */
public interface IEmpresaService {

    //Importamos los metodos
    public List<Empresa> findAll();

    public Page<Empresa> findAll(Pageable pageable);

    public Empresa findById(Integer id);

    public Empresa save(Empresa cliente);

    public void delete(Integer id);
}
